import {LearnItem$} from '../models/LearnItem$'
import {importanceDescriptorsArrayFromHighestNumeric} from '../models/fields/importance.model'
import {minBy} from 'lodash-es'
import {TimeMsEpoch} from '../../../libs/AppFedShared/utils/type-utils'
import {QuizOptions} from './quiz.service'

/**
 * TODO consider also QuizItemsFilter - for filtering, where this class would only choose the most suitable item for the current moment
 * */
export class QuizItemChooser {

  chooseItemFromPending(pendingItems: LearnItem$[], quizOptions: QuizOptions) {
    this.pickRandomByImportance()

    return this.findPendingItemOfHighestImportance(pendingItems, quizOptions)
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

  private pickRandomByImportance() {
    // build map of importance-to-oldest-pending-item --
    // build table of random-range-to-importance, checking which importances have a pending item

    // randomly pick importance
    Math.random()

  }
}
