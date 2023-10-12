import {LearnItem$} from '../../models/LearnItem$'
import {DurationMs} from '../../../../libs/AppFedShared/utils/type-utils'
import {importanceDescriptorsArray} from '../../models/fields/importance.model'
import {CountsByImportance} from './quiz.service'

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
    public chooserParams?: any,
  ) {
  }

  private static countsAtLeastImportance(itemsLeftByImportance: any): CountsByImportance {
    const ret = {} as any
    let idx = 0
    let previousFilledVal: number | undefined = undefined
    for (let imp of importanceDescriptorsArray) {
      let sum = 0
      for (let internalIdx = idx; internalIdx < importanceDescriptorsArray.length; internalIdx++) {
        const impInternal = importanceDescriptorsArray[internalIdx]
        sum += itemsLeftByImportance[impInternal.id] ?? 0
      }
      // const previousIdx = idx - 1
      if ( /*previousIdx < 0 || */ (previousFilledVal !== sum)) {
        ret[imp.id] = sum
        previousFilledVal = sum
      }
      idx++
    }
    return ret
  }
}
