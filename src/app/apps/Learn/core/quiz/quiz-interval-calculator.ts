import {Rating, SelfRating} from '../../models/fields/self-rating.model'
import {Duration, QuizOptions} from './quiz.service'
import {nullish} from '../../../../libs/AppFedShared/utils/type-utils'
import {importanceDescriptors} from '../../models/fields/importance.model'
import {hoursAsMs} from '../../../../libs/AppFedShared/utils/time/date-time-utils'
import {ImportanceVal} from '../../models/LearnItem'

export class QuizIntervalCalculator {

  /** maybe pass effectiveImportance here too later */
  calculateIntervalHours(rating: SelfRating, quizOptions: QuizOptions | nullish): Duration {
    // debugLog(`calculateIntervalHours`, quizOptions)

    // TODO: consider a kind of LIFO to prioritize minute periods (for them to not be at mercy of smth delayed from days ago); Coz the difference between 1 minute and say 10 hours is much bigger than 10 hours and 11 hours
    // TODO: (right now the app is ok at relative priority/frequency, but necessarily too good at determining the exact time spacing
    // 0 => 1 min
    // 0.5 => few hours
    //
    // Ebbinghaus forgetting curve (related; but this equation is about time, not probability)
    // TODO: !!!! when rating zero, make it one minute (as in Anki), so that it goes in front of whatever stuff might have been there from previous days
    if ( rating === 0 ) {
      return 30 / 3600 // 30 seconds (could try 1 minute)
    }
    const powBase = ((quizOptions?.powBaseX100 ?? 300) / 100) ?? 3.5
    return 12 * Math.pow(Math.pow(powBase, 5), rating ?? 0)
  }

  calculateIntervalMs(
    lastSelfRating: SelfRating | nullish,
    quizOptions: QuizOptions | nullish,
    importance: ImportanceVal | nullish
  ) {
    const mediumImportanceNum = importanceDescriptors.medium.numeric
    const effectiveImportance = (importance?.numeric ?? mediumImportanceNum) / mediumImportanceNum

    const scaleByImp = (quizOptions?.scaleIntervalsByImportance ?? 1) / 1
    return hoursAsMs(this.calculateIntervalHours(lastSelfRating ?? (0 as SelfRating), quizOptions))
      / this.calculateMultiplierToScaleByImportance(scaleByImp, effectiveImportance) /* TODO: this should actually appear before some old stuff, to de-clutter */
  }

  private calculateMultiplierToScaleByImportance(scaleByImp: number, effectiveImportance: number) {
    // return 1 + scaleByImp * (effectiveImportance - 1) /* FIXME: -1 causes negative intervals */
    // return 1 + scaleByImp * (effectiveImportance - 0.49) /* FIXME: -1 causes negative intervals */
    // return 1 + scaleByImp * (effectiveImportance - 0.49) /* FIXME: -1 causes negative intervals */
    // 1.070
    // return scaleByImp * (Math.log2(effectiveImportance + 1.6)) /* FIXME: -1 causes negative intervals */
    return Math.pow(Math.log2(effectiveImportance + 1.6), scaleByImp) /* FIXME: -1 causes negative intervals */

    // TODO: scaleByImp should determine ratio of spread between lowest importance and highest, e.g. CfMtr being 10x shorter interval than XLo
    // later this could be based on probability of forgetting (e.g. Medium: 50%, XH: 5%)
  }
}
