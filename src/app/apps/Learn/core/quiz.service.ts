import { Injectable } from '@angular/core';
import {LearnDoService} from './learn-do.service'
import {OdmTimestamp} from '../../../libs/AppFedShared/odm/OdmBackend'

import {countBy, groupBy, minBy, sumBy} from 'lodash-es'
// import * as _ from "lodash";
// import {Observable} from 'rxjs'
import {combineLatest} from 'rxjs'
import {
  importanceDescriptors,
  ImportanceDescriptors,
  importanceDescriptorsArray,
  importanceDescriptorsArrayFromHighest,
  LearnItem,
  Rating,
} from '../models/LearnItem'

import {Observable,of, from } from 'rxjs';
import {LearnItem$} from '../models/LearnItem$'
import {debugLog} from '../../../libs/AppFedShared/utils/log'
import {DurationMs, nullish, TimeMsEpoch} from '../../../libs/AppFedShared/utils/type-utils'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {countBy2} from '../../../libs/AppFedShared/utils/utils'
import {hoursAsMs, isInFuture, secondsAsMs} from '../../../libs/AppFedShared/utils/time-utils'
import {debounceTime, filter, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators'
import {throttleTimeWithLeadingTrailing, throttleTimeWithLeadingTrailing_ReallyThrottle} from '../../../libs/AppFedShared/utils/rxUtils'
import {interval} from 'rxjs'
import {timer} from 'rxjs'
import {LocalOptionsPatchableObservable, OptionsService} from './options.service'
import {Subject} from 'rxjs/internal/Subject'

/* TODO units; rename to DurationMs or TimeDurationMs;
*   !!! actually this is used as hours, confusingly! WARNING! */
export type Duration = number



export class QuizOptions {
  constructor(
    public dePrioritizeNewMaterial: boolean,
    public onlyWithQA: boolean,
    public powBaseX100: number = 3
  ) {
  }
}

export type CountsByImportance = { [key in keyof ImportanceDescriptors]: number}

export class QuizStatus {

  public itemsLeftByImportanceAtLeast: any = QuizStatus.countsAtLeastImportance(this.itemsLeftByImportance)
  public itemsCountByImportanceAtLeast: any = QuizStatus.countsAtLeastImportance(this.itemsCountByImportance)

  constructor(
    public itemsLeft: number,
    public nextItem$?: LearnItem$,
    public itemsLeftToday?: number,
    public isNextItemInFuture?: boolean,
    public estimatedMsLeft?: DurationMs,
    // public itemsLeftByImportance?: CountsByImportance,
    public itemsLeftByImportance?: any,
    /* TODO: undefined */
    public itemsCountByImportance?: any,
  ) {}

  private static countsAtLeastImportance(itemsLeftByImportance: any): CountsByImportance {
    const ret = {} as any
    let idx = 0
    for ( let imp of importanceDescriptorsArray ) {
      let sum = 0
      for ( let internalIdx = idx; internalIdx < importanceDescriptorsArray.length; internalIdx ++ ) {
        const impInternal = importanceDescriptorsArray[internalIdx]
        sum += itemsLeftByImportance[impInternal.id] ?? 0
      }
      idx++
      ret[imp.id] = sum
    }
    return ret
  }
}


@Injectable({
  providedIn: 'root'
})
export class QuizService {

  options2$ = new LocalOptionsPatchableObservable<QuizOptions>(
    new QuizOptions(false, true), 'QuizOptions'
  )

  private isNextItemRequested = true

  get options$(): CachedSubject<QuizOptions> { return this.options2$.locallyVisibleChanges$ }

  showAnswer$ = new CachedSubject<boolean>(false)

  showHint$ = new CachedSubject<boolean>(false)

  constructor(
    private learnDoService: LearnDoService,
    private optionsService: OptionsService,
  ) {
    this.nextItemRequests$.next()
  }

  setOptions(newOptions: QuizOptions) {
    this.options$.next(newOptions)
  }

  nextItemRequests$ = new CachedSubject<void>()

  /** TODO make into a member field to ensure no-one calls this spuriously by accident */
  readonly quizStatus$: Observable<QuizStatus> = combineLatest(
    // TODO:  take into account: this.isWaitingForNextItem = true ; and set to false once new item provided; might need to change approach to a more pull-based
    // https://stackoverflow.com/questions/50276165/combinelatest-deprecated-in-favor-of-static-combinelatest
    this.options$,
    (this.learnDoService.localItems$.pipe(
      throttleTimeWithLeadingTrailing_ReallyThrottle(secondsAsMs(1))) as Observable<LearnItem$[]>
    ),
    combineLatest(
      timer(0, secondsAsMs(60) /* FIXME make the timer longer for performance/battery */),
      this.nextItemRequests$,
    ),
      // this.learnDoService.localItems$,
    (quizOptions: QuizOptions, item$s: LearnItem$[]) => {
      // debugLog(`quizStatus$ combineLatest; FIXME this runs multiple times; use smth like publish() / shareReplay`)
      if ( quizOptions.onlyWithQA ) {
        item$s = item$s.filter(item => item.currentVal ?. hasQAndA())
      }
      // filter remaining until now
      const nowMs: TimeMsEpoch = Date.now()

      let pendingItems: LearnItem$[] = item$s.filter(item$ => {
        const msEpochRepetition = this.calculateWhenNextRepetitionMsEpoch(item$)
        // if ( ! (typeof msEpochRepetition === 'number') ) {
        //   return false
        // }
        return msEpochRepetition <= nowMs
      })
      const endOfDayMs = Date.now() + hoursAsMs(12)
      const pendingItemsTodayCount = countBy2(item$s, item$ => {
        const msEpochRepetition = this.calculateWhenNextRepetitionMsEpoch(item$)
        return msEpochRepetition <= endOfDayMs
      }) /* If it's low, we could suggest adding new material, based on how much time user wants to spend per day */
      /* TODO: performance: make util method countMatchingAndSummarizeAndReturnFirst to not allocate array and not traverse twice
         summarize - estimatedTimeLeft
       */
      let nextItem$ = this.findPendingItemOfHighestImportance(pendingItems)
      const retStatus = new QuizStatus(
        pendingItems.length,
        nextItem$,
        pendingItemsTodayCount,
        isInFuture(this.calculateWhenNextRepetitionMsEpoch(nextItem$)),
        undefined,
        countBy(pendingItems, (item) => item.val?.importance?.id) as CountsByImportance,
        countBy(item$s, (item) => item.val?.importance?.id) as CountsByImportance,
        // pendingItems[0] /* TODO: ensure sorted or minBy */,
      );

      // if ( retStatus.itemsLeft ) {
      //   debugLog(`quiz: pendingItems`, retStatus.itemsLeft) // this logs a lot
      // }

      return retStatus

      // console.log(`this.learnDoService.localItems$.pipe item$s`, item$s.length)
      // return minBy(item$s,
      //   (item$: LearnItem$) => this.calculateWhenNextRepetitionMsEpoch(item$, quizOptions.dePrioritizeNewMaterial))
    },
  ).pipe(shareReplay(1))


  /** too imperative style, but quick workaround for now, in the face of withLatestFrom approach not showing quiz item on page load */
  nextItem$WhenRequested: Observable<LearnItem$ | nullish> = this.quizStatus$.pipe(
    map(status => status?.nextItem$),
    filter((item) => !! item && this.isNextItemRequested),
    tap(() => {
      debugLog(`nextItem$WhenRequested ver2`)
      this.isNextItemRequested = false
    }),
    shareReplay(1),
  )

  /* ==== Approach with withLatestFrom - worked when pressing Apply&Next button, but NOT showing any quiz item at the loading of quiz page.
   * Maybe putting it with combineLatest with timer has already helped. Need testing. I leave it like that for now.
   * Need to get deeper into understanding semantics of when pipes before someone subscribes, multiple subscribers, and shareReplay(1) */
  // could combine the nextItemRequests$ with timer operator
  // nextItem$WhenRequested: Observable<LearnItem$ | undefined> = this.nextItemRequests$.pipe(
  //   tap(x => debugLog(`nextItemRequests$`, x)),
  //   shareReplay(1),
  //   withLatestFrom(this.quizStatus$.pipe(
  //     filter(status => !! status.nextItem$),
  //     tap(x => debugLog(`withLatestFrom filter`, x)),
  //     shareReplay(1),
  //   )),
  //   map((merged: [void, QuizStatus]) => merged[1].nextItem$),
  //   shareReplay(1),
  //   tap(x => debugLog(`nextItem$WhenRequested`, x))
  // )


  private findPendingItemOfHighestImportance(pendingItems: LearnItem$[]): LearnItem$ | undefined {
    let nextItem$: LearnItem$ | undefined = undefined
    for (let importance of importanceDescriptorsArrayFromHighest) {
      const filteredByImportance = pendingItems.filter(item => (item.val?.importance?.id ?? importanceDescriptors.medium.id) === importance.id)
      // TODO: performance: could reuse itemsLeftByImportance from QuizStatus, instead of filtering (oh, but those are just counts; but could replace by groupBy; OTOH, we don't need all of the arrays, just the non-empty one with highest importance)
      if (filteredByImportance.length) {
        // TODO: performance: maybe combine filter and minBy into something like minByIf, to just iterate once
        nextItem$ = nextItem$ = minBy(filteredByImportance,
          (item$: LearnItem$) => this.calculateWhenNextRepetitionMsEpoch(item$))
        break
      }
    }
    return nextItem$
  }

  calculateIntervalHours2(rating: Rating): Duration {
    return this.calculateIntervalHours(rating, this.options$?.lastVal !)
  }

  calculateIntervalHours(rating: Rating, quizOptions: QuizOptions): Duration {
    // debugLog(`calculateIntervalHours`, quizOptions)

    // TODO: consider a kind of LIFO to prioritize minute periods (for them to not be at mercy of smth delayed from days ago); Coz the difference between 1 minute and say 10 hours is much bigger than 10 hours and 11 hours
    // TODO: (right now the app is ok at relative priority/frequency, but necessarily too good at determining the exact time spacing
    // 0 => 1 min
    // 0.5 => few hours
    //
    // Ebbinghaus forgetting curve (related; but this equation is about time, not probability)
    // TODO: !!!! when rating zero, make it one minute (as in Anki), so that it goes in front of whatever stuff might have been there from previous days
    if ( rating === 0 ) {
      return 30/3600 // 30 seconds (could try 1 minute)
    }
    return 12 * Math.pow(((quizOptions.powBaseX100 ?? 300) / 100) ?? 3.5, rating || 0)
  }

  /** This could be a method of LearnItem$ */
  calculateWhenNextRepetitionMsEpoch(item$: LearnItem$ | null | undefined): TimeMsEpoch {
    const dePrioritizeNewMaterial = this.options$.lastVal !. dePrioritizeNewMaterial
    // TODO: extract into strategy pattern class LearnAlgorithm or RepetitionAlgorithm
    if ( ! item$ ) {
      return 0
    }
    const item = item$.currentVal
    if ( ! item ) {
      return 0
    }
    const whenLastTouched: OdmTimestamp | null =
      item.whenLastSelfRated ||
      // item.whenLastModified || /* garbled by accidental patching of all items */
      (dePrioritizeNewMaterial ? null : item.whenAdded) // ||
      // item.whenCreated /* garbled by accidental patching of all items */

    if ( ! whenLastTouched ) {
      return dePrioritizeNewMaterial ? new Date(2199, 1, 1).getTime() : 0 // Date.now() + 365 * 24 * 3600 * 1000 : 0 // 1970
    }

    /* in the future this might be `..priority... ?? ...importance...` for life-wide vs in-the-moment (priority overrides; importance as fallback)
       http://localhost:4207/learn/item/f3kXRceky6eoJ3adB45S
    **/
    const mediumNumeric = importanceDescriptors.medium.numeric
    const effectiveImportance = (item.importance?.numeric ?? mediumNumeric) / mediumNumeric
    const interval = hoursAsMs(this.calculateIntervalHours(item.lastSelfRating || 0, this.options$.lastVal !))
      / effectiveImportance /* TODO: this should actually appear before some old stuff, to de-clutter */
    const ret = whenLastTouched.toMillis() + interval
    return ret

    // TODO: could store this in DB, so that I can make faster firestore queries later, sort by next repetition time (although what if the algorithm changes...)
  }

  toggleShowAnswer() {
    this.showAnswer$.next(! this.showAnswer$.lastVal)
    this.showHint$.next(false)
  }

  toggleShowHint() {
    this.showHint$.next(! this.showHint$.lastVal)
  }

  onNewQuestion() {
    this.showAnswer$.next(false)
    this.showHint$.next(false)
  }

  requestNextItem() {
    debugLog(`requestNextItem()`)
    this.isNextItemRequested = true
    this.nextItemRequests$.next()
  }
}
