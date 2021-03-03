import {LearnItem$} from '../../models/LearnItem$'
import {ImportanceDescriptor, importanceDescriptorsArrayFromHighestNumeric} from '../../models/fields/importance.model'
import {countBy, minBy} from 'lodash-es'
import {TimeMsEpoch} from '../../../../libs/AppFedShared/utils/type-utils'
import {QuizOptions} from './quiz.service'
import {countBy2, isNotNullish, minsGroupBy} from '../../../../libs/AppFedShared/utils/utils'
import {pickRandomWeighted} from '../../../../libs/AppFedShared/utils/randomUtils'

/**
 * TODO consider also QuizItemsFilter - for filtering, where this class would only choose the most suitable item for the current moment
 * */
export class QuizItemChooser {

  constructor(
    public pendingItems: LearnItem$[],
    public quizOptions: QuizOptions
  ) {
  }

  chooseItemFromPending() {
    // this.testStatistically()
    return this.pickRandomWeighedByImportance()

    // return this.findPendingItemOfHighestImportance(pendingItems, quizOptions)
  }

  private findPendingItemOfHighestImportance(): LearnItem$ | undefined {
    // write separate func for random choice, and leave this one for now
    let nextItem$: LearnItem$ | undefined = undefined
    for (let importance of importanceDescriptorsArrayFromHighestNumeric) {
      // FIXME SPEEDUP: don't go nImportanceDescriptors * nItems
      const filteredByImportance = this.pendingItems.filter(item$ => (item$.getEffectiveImportanceId()) === importance.id)
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
    return item$?.quiz?.calculateWhenNextRepetitionMsEpoch(this.quizOptions)
  }

  private pickRandomWeighedByImportance(): LearnItem$ | undefined {
    const mins = minsGroupBy(this.pendingItems,
      (item$: LearnItem$) => this.calculateWhenNextRepetitionMsEpoch(item$),
      (item$: LearnItem$) => item$.getEffectiveImportanceNumeric(),
    )
    const weighted: Array<[number, LearnItem$]> = []
    for ( let importance of importanceDescriptorsArrayFromHighestNumeric ) {
      const fromMap = mins.get(importance.numeric)
      if ( isNotNullish(fromMap) ) {
        weighted.push([this.calculateProbabilityWeight(fromMap), fromMap[1]])
      }
    }
    return pickRandomWeighted(weighted)
  }

  private calculateProbabilityWeight(fromMap: [number, LearnItem$]) {
    const weightSlider = 1
    //

    return fromMap[1].getEffectiveImportanceNumeric()
  }

  private testStatistically() {
    const arr: Array<LearnItem$|undefined> = []
    for ( let i = 0; i < 10_000; ++ i ) {
      arr.push(this.pickRandomWeighedByImportance())
    }
    console.log(`testStatistically`, countBy(arr, x => x ?. getEffectiveImportanceNumeric()))

  }
}
