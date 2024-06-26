import {Injectable} from '@angular/core';
import {LearnItemItemsService} from '../learn-item-items.service'

import {countBy} from 'lodash-es'
// import * as _ from "lodash";
// import {Observable} from 'rxjs'
import {combineLatest, Observable, timer} from 'rxjs'
import {ImportanceVal} from '../../models/LearnItem'
import {LearnItem$} from '../../models/LearnItem$'
import {debugLog} from '../../../../libs/AppFedShared/utils/log'
import {DurationMs, nullish, TimeMsEpoch} from '../../../../libs/AppFedShared/utils/type-utils'
import {CachedSubject} from '../../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {countBy2} from '../../../../libs/AppFedShared/utils/utils'
import {hoursAsMs, isInFuture, secondsAsMs} from '../../../../libs/AppFedShared/utils/time/date-time-utils'
import {debounceTime, filter, map, shareReplay, tap} from 'rxjs/operators'
import {throttleTimeWithLeadingTrailing_ReallyThrottle} from '../../../../libs/AppFedShared/utils/rxUtils'
import {LocalOptionsPatchableObservable, OptionsService} from '../options.service'
import {Rating} from '../../models/fields/self-rating.model'
import {ImportanceDescriptors} from '../../models/fields/importance.model'
import {QuizIntervalCalculator} from './quiz-interval-calculator'
import {mentalEffortLevels} from '../../models/fields/mental-effort-level.model'
import {funLevels} from '../../models/fields/fun-level.model'
import {QuizItemChooser} from './quiz-item-chooser'
import {QuizStatus} from './QuizStatus'
import {QuizOptions} from './QuizOptions'

/* TODO units; rename to DurationMs or TimeDurationMs;
*   !!! actually this is used as hours, confusingly! WARNING! */
export type Duration = number


export type CountsByImportance = { [key in keyof ImportanceDescriptors]: number}


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
    private learnDoService: LearnItemItemsService,
    private optionsService: OptionsService,
  ) {
    console.log('QuizService service constructor')
    // throw new Error(`QuizService service constructor`)
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
      debounceTime(4000),
      // FIXME: performance: debounce and more ms
        // also anything using `localItems$.pipe` is suspicious
      throttleTimeWithLeadingTrailing_ReallyThrottle(secondsAsMs(1))) as Observable<LearnItem$[]>
    ),
    combineLatest(
      timer(0, secondsAsMs(60) /* FIXME make the timer longer for performance/battery */),
      this.nextItemRequests$,
    ),
    (quizOptions: QuizOptions, item$s: LearnItem$[]) => {
      // debugLog(`quizStatus$ combineLatest; FIXME this runs multiple times; use smth like publish() / shareReplay`)
      item$s = this.filterByOptions(quizOptions, item$s)

      let pendingItems = this.filterByIsPendingRepetition(item$s)

      const quizItemChooser = new QuizItemChooser(pendingItems, quizOptions)

      let chooserOutput = quizItemChooser.chooseItemFromPending()
      const nextItem$ = chooserOutput.item

      const retStatus = new QuizStatus(
        pendingItems.length,
        nextItem$,
        this.calculatePendingItemsTodayCount(item$s),
        nextItem$ ? isInFuture(this.calculateWhenNextRepetitionMsEpoch(nextItem$)) : undefined,
        undefined,
        countBy(pendingItems, (item$) => item$.getEffectiveImportanceId()) as CountsByImportance,
        countBy(item$s, (item$) => item$.getEffectiveImportanceId()) as CountsByImportance,
        chooserOutput.chooserParams
        // pendingItems[0] /* TODO: ensure sorted or minBy */,
      );

      return retStatus

      // return minBy(item$s,
      //   (item$: LearnItem$) => this.calculateWhenNextRepetitionMsEpoch(item$, quizOptions.dePrioritizeNewMaterial))
    },
  ).pipe(shareReplay(1))


  private calculatePendingItemsTodayCount(item$s: LearnItem$[]) {
    const endOfDayMs = Date.now() + hoursAsMs(12)
    const pendingItemsTodayCount = countBy2(item$s, item$ => {
      const msEpochRepetition = this.calculateWhenNextRepetitionMsEpoch(item$)
      return msEpochRepetition <= endOfDayMs
    }) /* If it's low, we could suggest adding new material, based on how much time user wants to spend per day */
    /* TODO: performance: make util method countMatchingAndSummarizeAndReturnFirst to not allocate array and not traverse twice
       summarize - estimatedTimeLeft
     */
    return pendingItemsTodayCount
  }

  /** Potentially move to QuizItemChooser or QuizItemsFilter... */
  private filterByIsPendingRepetition(item$s: LearnItem$[]) {
    // filter remaining until now
    const nowMs: TimeMsEpoch = Date.now()

    let pendingItems: LearnItem$[] = item$s.filter(item$ => {
      const msEpochRepetition = this.calculateWhenNextRepetitionMsEpoch(item$)
      // if ( ! (typeof msEpochRepetition === 'number') ) {
      //   return false
      // }
      return msEpochRepetition <= nowMs
    })
    return pendingItems
  }

  /** Potentially move to QuizItemChooser or QuizItemsFilter... */
  private filterByOptions(quizOptions: QuizOptions, item$s: LearnItem$[]) {

    // FIXME: perf: one .filter() call, with multiple predicates
    if (quizOptions.onlyWithQA) {
      item$s = item$s.filter(item => item.val?.hasQAndA())
    } // TODO: performance - join the .filters
    if (quizOptions.skipTasks) {
      item$s = item$s.filter(item => !(item.val?.isTask))
    }
    // item$s = this.filterByMentalLevel(item$s)
    // item$s = this.filterByFunLevel(item$s)

    // slowest: last?
    item$s = item$s.filter(
      (item$) => {
        return item$.hasEffectiveFunLevelAtLeast(quizOptions.minFunLevel)
      }
    )
    item$s = this.filterByCategories(item$s, quizOptions)
    return item$s
  }

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
    if ( importance ) { // TODO move this "if" into quizIntervalCalculator
      return this.quizIntervalCalculator.calculateIntervalMs(rating, this.options$?.lastVal !, importance)
    }
    return this.quizIntervalCalculator.calculateIntervalHours(rating, this.options$?.lastVal !)
  }

  toggleShowAnswer() {
    const showAnswer = ! this.showAnswer$.lastVal
    this.showAnswer$.next(showAnswer)
    this.showHint$.next(false)
  }

  toggleShowHint() {
    // TODO: increase hint count (characters; stripHtml(), trim())
    this.showHint$.next(! this.showHint$.lastVal)
  }

  onNewQuestion() {
    this.showAnswer$.next(false)
    this.showHint$.next(false)
  }

  requestNextItem() {
    debugLog(`QuizService: requestNextItem()`)
    this.isNextItemRequested = true
    this.nextItemRequests$.next()

    /// whatnext
  }

  /** Potentially move to QuizItemChooser or QuizItemsFilter... */
  private filterByCategories(item$s: LearnItem$[], quizOptions: QuizOptions) {
    const trimAllFunc = (strings?: string[]) => strings ?. map(string => string ?.trim())
    const getArr = (inputStr?: string) => trimAllFunc(inputStr ?. trim() ?. toLowerCase() ?. split(',')) ?? []
    const filterCategories: string[] = getArr(quizOptions.categories)
    const textFilterStrings: string[] = getArr(quizOptions.textFilter)
    console.log(`textFilterStrings`, textFilterStrings) /* FIXME: this could be the slowdown during typing; as it prolly string-filters all thousands of items on every save */

    // const categories = [`health`, `interview`]
    // const categories = [
    //   `#codility`,
    //   `#interview`,
    //   // `angular`,
    //   // `js`,
    //   // `html`,
    //   // `web`,
    // ]
    // #Toptal
    // #ForInterview
    // sleep
    // health
    // strategy

    // note: not using word "tags" ; let's reserve this word for #SomeCategory hashtag occurrence maybe.
    if ( item$s ?. length && (filterCategories.length || textFilterStrings.length) ) {
      item$s = item$s.filter(
        (item$) => {
          // return true
          const hasAnyCategory = item$.hasAnyCategory(filterCategories)
          // console.log('hasAnyCategory', hasAnyCategory, item$.val?.title, filterCategories)
          return hasAnyCategory && item$.matchesAnyFilterText(textFilterStrings)
        }
      )
    }

    return item$s
  }

  /** Potentially move to QuizItemChooser or QuizItemsFilter... */
  private filterByMentalLevel(item$s: LearnItem$[]) {
    return item$s.filter(
      item$ =>
        item$.getEffectiveMentalEffort().numeric
        < mentalEffortLevels.somewhat_high.numeric
    )
  }

  /** Potentially move to QuizItemChooser or QuizItemsFilter... */
  private filterByFunLevel(item$s: LearnItem$[]) {
    return item$s.filter(
      item$ =>
        item$.getEffectiveFunLevel().numeric
        > funLevels.somewhat_high.numeric
    )
  }
}
