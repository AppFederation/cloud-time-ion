import { Injectable } from '@angular/core';
import {LearnDoService} from './learn-do.service'
import {OdmTimestamp} from '../../../libs/AppFedShared/odm/OdmBackend'

import {countBy, groupBy, minBy, sumBy} from 'lodash-es'
// import * as _ from "lodash";
// import {Observable} from 'rxjs'
import {combineLatest} from 'rxjs'
import {
  ImportanceVal,
  LearnItem,

} from '../models/LearnItem'

import {Observable,of, from } from 'rxjs';
import {LearnItem$} from '../models/LearnItem$'
import {debugLog} from '../../../libs/AppFedShared/utils/log'
import {DurationMs, nullish, TimeMsEpoch} from '../../../libs/AppFedShared/utils/type-utils'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {countBy2} from '../../../libs/AppFedShared/utils/utils'
import {hoursAsMs, isInFuture, secondsAsMs} from '../../../libs/AppFedShared/utils/time/date-time-utils'
import {debounceTime, filter, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators'
import {throttleTimeWithLeadingTrailing, throttleTimeWithLeadingTrailing_ReallyThrottle} from '../../../libs/AppFedShared/utils/rxUtils'
import {interval} from 'rxjs'
import {timer} from 'rxjs'
import {LocalOptionsPatchableObservable, OptionsService} from './options.service'
import {Subject} from 'rxjs/internal/Subject'
import {Rating} from '../models/fields/self-rating.model'
import {
  ImportanceDescriptors,
  importanceDescriptors,
  importanceDescriptorsArray,
  importanceDescriptorsArrayFromHighestNumeric,
} from '../models/fields/importance.model'
import {QuizIntervalCalculator} from '../models/quiz-interval-calculator'

/* TODO units; rename to DurationMs or TimeDurationMs;
*   !!! actually this is used as hours, confusingly! WARNING! */
export type Duration = number


/** FIXME: keep in mind that if options existed, they will not be overridden, and will be missing fields; so should {...defaultOptions, ...options}*/
export class QuizOptions {
  constructor(
    public dePrioritizeNewMaterial: boolean,
    public onlyWithQA: boolean,
    public powBaseX100: number = 300,
    public skipTasks: boolean = true,
    public scaleIntervalsByImportance = 1, // 0 .. 1 (0 no scale, 1: current default: scale per importance multiplier. >1 scale even more)
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
    let previousFilledVal: number | undefined = undefined
    for ( let imp of importanceDescriptorsArray ) {
      let sum = 0
      for ( let internalIdx = idx; internalIdx < importanceDescriptorsArray.length; internalIdx ++ ) {
        const impInternal = importanceDescriptorsArray[internalIdx]
        sum += itemsLeftByImportance[impInternal.id] ?? 0
      }
      // const previousIdx = idx - 1
      if ( /*previousIdx < 0 || */ (previousFilledVal !== sum ) ) {
        ret[imp.id] = sum
        previousFilledVal = sum
      }
      idx++
    }
    return ret
  }
}


@Injectable({
  providedIn: 'root'
})
export class QuizService {

  quizIntervalCalculator = new QuizIntervalCalculator()

  options2$ = new LocalOptionsPatchableObservable<QuizOptions>(
    new QuizOptions(false, true), 'QuizOptions'
  )

  private isNextItemRequested = true

  get options$(): CachedSubject<QuizOptions> {
    return this.options2$.locallyVisibleChanges$
  }

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
        item$s = item$s.filter(item => item.val ?. hasQAndA() )
      } // TODO: performance - join the .filters
      if ( quizOptions.skipTasks ) {
        item$s = item$s.filter(item => ! (item.val ?. isTask) )
      }
      // filter remaining until now
      const nowMs: TimeMsEpoch = Date.now()

      item$s = this.filterByCategories(item$s)

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
        nextItem$ ? isInFuture(this.calculateWhenNextRepetitionMsEpoch(nextItem$)) : undefined,
        undefined,
        countBy(pendingItems, (item$) => item$.getEffectiveImportanceId()) as CountsByImportance,
        countBy(item$s, (item$) => item$.getEffectiveImportanceId()) as CountsByImportance,
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
    filter((item) => !! item && this.isNextItemRequested /* hack (via external field) ? */),
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
    for (let importance of importanceDescriptorsArrayFromHighestNumeric) {
      const filteredByImportance = pendingItems.filter(item$ => (item$.getEffectiveImportanceId()) === importance.id)
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

  calculateWhenNextRepetitionMsEpoch(item$: LearnItem$): TimeMsEpoch {
    return item$?.quiz?.calculateWhenNextRepetitionMsEpoch(this.options$.lastVal)
  }

  calculateWhenNextRepetitionMsEpochOrNullish(item$: LearnItem$ | nullish): TimeMsEpoch | nullish {
    if ( ! item$ ) {
      return item$ as nullish
    }
    return this.calculateWhenNextRepetitionMsEpoch(item$)
  }


  calculateIntervalMs(rating: Rating, importance?: ImportanceVal): DurationMs {
    if ( importance ) {
      return this.quizIntervalCalculator.calculateIntervalMs(rating, this.options$?.lastVal !, importance)
    }
    return this.quizIntervalCalculator.calculateIntervalHours(rating, this.options$?.lastVal !)
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

  private filterByCategories(item$s: LearnItem$[]) {
    // const categories = [`health`, `interview`]
    const categories = [
      `codility`,
      `interview`,
      `angular`,
      `js`,
      `html`,
      `web`,
    ]
    // note: not using word "tags" ; let's reserve this word for #SomeCategory hashtag occurrence maybe.

    return item$s.filter(
      (item$) => {
        return item$.hasAnyCategory(categories)
      }
    )
  }
}
