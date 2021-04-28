import {LearnItem$} from '../../models/LearnItem$'
import {ImportanceDescriptor, importanceDescriptorsArrayFromHighestNumeric} from '../../models/fields/importance.model'
import {countBy, minBy, sumBy} from 'lodash-es'
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
      const filteredByImportance = this.pendingItems.filter(
        item$ => (item$.getEffectiveImportanceId()) === importance.id
      )
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

  private pickRandomWeighedByImportance() {
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

    return {
      item: pickRandomWeighted(weighted),
      chooserParams: {
        probabilitiesByImportance: this.printProbabilityPercent(weighted)
      }
    }
  }

  private calculateProbabilityWeight(fromMap: [number, LearnItem$]) {
    // const weightSlider = 1.05 /* 50% */ // 0.3
    const weightSlider = 3 // "CFMtr": "87.57%", "CF": "10.95%", "MtMtr": "1.37%"
    // const weightSlider = 2 // 0.3
    // const weightSlider = 1.5 // 0.3
    const importanceNumeric = fromMap[1].getEffectiveImportanceNumeric()

    // - 1 = x * -1 - ...... 2 ^ -2x opposite to importance numeric
    //   0 = x * 0.5 ..;. * 2 ^ -x - no weighting
    //   1 = x * 1 - ..... * 2 ^ 0 weighting according to importance numeric
    //  ~30 --- only highest importance
    // the lower the value, the more anti-boredom

    // NOTE: weights sum probably cannot be zero
    // return 1;
    // return fromMap[1].getEffectiveImportanceNumeric()
    // return Math.pow( 2, fromMap[1].getEffectiveImportanceNumeric() * ( weightSlider - 1))

    // return fromMap[1].getEffectiveImportanceNumeric() *
    //   Math.pow( 2, fromMap[1].getEffectiveImportanceNumeric() * ( weightSlider - 1))

    // return Math.pow( 1, fromMap[1].getEffectiveImportanceNumeric() * ( weightSlider - 1)) *
    //   Math.pow( 2, fromMap[1].getEffectiveImportanceNumeric() * ( weightSlider - 1))

    return Math.pow( importanceNumeric, weightSlider)
  }

  private testStatistically() {
    const arr: Array<LearnItem$|undefined> = []
    for ( let i = 0; i < 1000; ++ i ) {
      arr.push(this.pickRandomWeighedByImportance().item)
    }
    console.log(`testStatistically`, countBy(arr, x => x ?. getEffectiveImportanceNumeric()))

  }

  private printProbabilityPercent(weighted: Array<[number, LearnItem$]>) {
    const sum = sumBy(weighted, x=>x[0])
    const probabilities: any = {}
    for ( let weigh of weighted ) {
      const shortId = weigh[1].getEffectiveImportanceShortId()
      const percentString = '' + (weigh[0] / sum * 100).toFixed(2) + '%'
      console.log(`printProbabilityPercent`, percentString + ' '  + shortId)
      probabilities[shortId] = percentString
    }

    return probabilities
  }
}
