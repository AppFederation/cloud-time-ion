import {LearnItem$} from '../models/LearnItem$'
import {ImportanceDescriptor, importanceDescriptorsArrayFromHighestNumeric} from '../models/fields/importance.model'
import {countBy, minBy} from 'lodash-es'
import {TimeMsEpoch} from '../../../libs/AppFedShared/utils/type-utils'
import {QuizOptions} from './quiz.service'
import {countBy2, isNotNullish, minsGroupBy} from '../../../libs/AppFedShared/utils/utils'
import {pickRandomWeighted} from '../../../libs/AppFedShared/utils/randomUtils'

/**
 * TODO consider also QuizItemsFilter - for filtering, where this class would only choose the most suitable item for the current moment
 * */
export class QuizItemChooser {

  chooseItemFromPending(pendingItems: LearnItem$[], quizOptions: QuizOptions) {
    this.testStatistically(pendingItems, quizOptions)
    return this.pickRandomWeighedByImportance(pendingItems, quizOptions)

    // return this.findPendingItemOfHighestImportance(pendingItems, quizOptions)
  }

  private findPendingItemOfHighestImportance(pendingItems: LearnItem$[], quizOptions: QuizOptions): LearnItem$ | undefined {
    // write separate func for random choice, and leave this one for now
    let nextItem$: LearnItem$ | undefined = undefined
    for (let importance of importanceDescriptorsArrayFromHighestNumeric) {
      // FIXME SPEEDUP: don't go nImportanceDescriptors * nItems
      const filteredByImportance = pendingItems.filter(item$ => (item$.getEffectiveImportanceId()) === importance.id)
      // TODO: performance: could reuse itemsLeftByImportance from QuizStatus, instead of filtering (oh, but those are just counts; but could replace by groupBy; OTOH, we don't need all of the arrays, just the non-empty one with highest importance)
      if (filteredByImportance.length) {
        // TODO: performance: maybe combine filter and minBy into something like minByIf, to just iterate once
        nextItem$ = nextItem$ = minBy(filteredByImportance,
          (item$: LearnItem$) => this.calculateWhenNextRepetitionMsEpoch(item$, quizOptions))
        break
      }
    }
    return nextItem$
  }

  calculateWhenNextRepetitionMsEpoch(item$: LearnItem$, quizOptions: QuizOptions): TimeMsEpoch {
    return item$?.quiz?.calculateWhenNextRepetitionMsEpoch(quizOptions)
  }

  private pickRandomWeighedByImportance(pendingItems: LearnItem$[], quizOptions: QuizOptions): LearnItem$ | undefined {
    const mins = minsGroupBy(pendingItems,
      (item$: LearnItem$) => this.calculateWhenNextRepetitionMsEpoch(item$, quizOptions),
      (item$: LearnItem$) => item$.getEffectiveImportanceNumeric(),
    )
    const weighted: Array<[number, LearnItem$]> = []
    for ( let importance of importanceDescriptorsArrayFromHighestNumeric ) {
      const fromMap = mins.get(importance.numeric)
      if ( isNotNullish(fromMap) ) {
        weighted.push([fromMap[1].getEffectiveImportanceNumeric(), fromMap[1]])
      }
    }
    return pickRandomWeighted(weighted)
  }

  private testStatistically(pendingItems: LearnItem$[], quizOptions: QuizOptions) {
    const arr: Array<LearnItem$|undefined> = []
    for ( let i = 0; i < 10_000; ++ i ) {
      arr.push(this.pickRandomWeighedByImportance(pendingItems, quizOptions))
    }
    console.log(`testStatistically`, countBy(arr, x => x ?. getEffectiveImportanceNumeric()))

  }
}
