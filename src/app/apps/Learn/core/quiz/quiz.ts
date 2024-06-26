import {OdmTimestamp} from '../../../../libs/AppFedShared/odm/OdmBackend'
import {Rating} from '../../models/fields/self-rating.model'
import {ImportanceVal, PositiveInt, PositiveIntOrZero} from '../../models/LearnItem'
import {DurationMs, nullish, TimeMsEpoch} from '../../../../libs/AppFedShared/utils/type-utils'
import {QuizIntervalCalculator} from './quiz-interval-calculator'
import {QuizOptions} from './QuizOptions'

(Date.prototype as any).toMillis = function() {
  return this.getTime()
}


export interface QuizzableData {
  whenAdded ? : OdmTimestamp

  importance ? : ImportanceVal

  lastSelfRating ? : Rating
  whenLastSelfRated ? : OdmTimestamp
  selfRatingsCount ? : PositiveIntOrZero
}

export interface Quizzable$ {
  // val$: PatchableObservable<QuizzableData | nullish>
  val: QuizzableData | nullish
  getEffectiveImportance(): ImportanceVal
}

/** QuizzableMixin?
 * It's for
 * - convenience: item$.quiz. ....
 * - performance
 * - separation of concerns within Item$
 * */
export class Quiz {

  constructor(
    // public injector: Injector,
    public quizzable$: Quizzable$,
  ) {
  }

  quizIntervalCalculator = new QuizIntervalCalculator()

  // quizService = this.injector.get(QuizService)

  /** TODO next step is for this class to be able to figure out quizOptions on its own */
  calculateWhenNextRepetitionMsEpoch(quizOptions: QuizOptions | nullish): TimeMsEpoch {
    const dePrioritizeNewMaterial = quizOptions?.dePrioritizeNewMaterial
    // TODO: extract into strategy pattern class LearnAlgorithm or RepetitionAlgorithm
    const itemVal = this.quizzable$.val
    if ( ! itemVal ) {
      return 0
    }
    const whenLastTouched: OdmTimestamp | nullish =
      itemVal.whenLastSelfRated ||
      // itemVal.whenLastModified || /* garbled by accidental patching of all items */
      (dePrioritizeNewMaterial ? null : itemVal.whenAdded) // ||
    // itemVal.whenCreated /* garbled by accidental patching of all items */

    if ( ! whenLastTouched ) {
      return dePrioritizeNewMaterial ? new Date(2199, 1, 1).getTime() : 0 // Date.now() + 365 * 24 * 3600 * 1000 : 0 // 1970
    }
    const interval = this.calculateInterval(this.quizzable$, quizOptions)
    const ret = whenLastTouched.toMillis() + interval
    return ret

    // TODO: could store this in DB, so that I can make faster firestore queries later, sort by next repetition time (although what if the algorithm changes...)
  }

  private calculateInterval(itemVal: Quizzable$, quizOptions: QuizOptions | nullish): DurationMs {
    /* in the future this might be `..priority... ?? ...importance...` for life-wide vs in-the-moment (priority overrides; importance as fallback)
       http://localhost:4207/learn/item/f3kXRceky6eoJ3adB45S
    **/
    return this.quizIntervalCalculator.calculateIntervalMs(
      itemVal.val?.lastSelfRating, quizOptions, itemVal.getEffectiveImportance()
    )
  }

}
