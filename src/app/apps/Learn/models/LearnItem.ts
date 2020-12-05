import {OdmItemId} from '../../../libs/AppFedShared/odm/OdmItemId'
import {OdmInMemItem} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {OdmTimestamp} from '../../../libs/AppFedShared/odm/OdmBackend'
import {Side, SidesDefs, sidesDefsArray, sidesDefsHintsArray, SideVal} from '../core/sidesDefs'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {Rating} from './fields/self-rating.model'
import {ImportanceDescriptors} from './fields/importance.model'
import {htmlToId, stripHtml} from '../../../libs/AppFedShared/utils/html-utils'
import {parseDurationToMs} from '../../../libs/AppFedShared/utils/time/parse-duration'
import {QuizzableData} from './quiz'
import {FunDescriptors} from './fields/fun-level.model'
import {MentalEffortLevelDescriptors} from './fields/mental-effort-level.model'
import {isNotNullish, isNullish, isNullishOrEmptyOrBlank} from '../../../libs/AppFedShared/utils/utils'
import {parseDate} from '../../../libs/AppFedShared/utils/time/parse-date'
import {Deferrability, Urgency} from './planning-prioritizing.model'
import {daysAsMs, hoursAsMs, isInFuture, isInThePastOrNullish} from '../../../libs/AppFedShared/utils/time/date-time-utils'
import {StatusDef, statuses} from './statuses.model'
import {Dict} from '../../../libs/AppFedShared/utils/dictionary-utils'

export type LearnItemId = OdmItemId<LearnItem>


export type PositiveInt = number & {constraint: 'positive int'}

/** TOdo name NonNegativeInt */
export type PositiveIntOrZero = number // & {constraint: 'positive int or zero'}

export type IntensityVal = {
  id: keyof ImportanceDescriptors,
  numeric: number,
}

export type HtmlString = string


export type ImportanceVal = IntensityVal
export type ImportanceId = keyof ImportanceDescriptors

export type FunVal = IntensityVal
export type FunLevelId = keyof FunDescriptors

export type MentalLevelVal = IntensityVal
export type MentalLevelId = keyof MentalEffortLevelDescriptors


/** LearnDoItemData */
export class LearnItem extends OdmInMemItem implements QuizzableData {

  id?: LearnItemId
  whenAdded ! : OdmTimestamp
  title?: string
  isTask?: boolean
  isToLearn?: boolean

  status: string | nullish

  hasAudio?: true | null
  whenDeleted?: Date
  lastSelfRating?: Rating
  whenLastSelfRated?: OdmTimestamp

  // isMarkedAsSelectedOrUnselected ? : boolean
  isSelectedOrUnselected ? : boolean

  /** storing zero could be useful for querying for stuff that was not yet rated */
  selfRatingsCount ? : PositiveIntOrZero

  /** synonyms: worth
   * storing both name and numeric value, in case it changes in the future
   */
  importance ? : ImportanceVal

  funEstimate ? : FunVal

  mentalLevelEstimate ? : MentalLevelVal

  /** keep in mind also: time-boxing */
  time_estimate ? : HtmlString

  money_estimate ? : HtmlString

  start_after ? : string

  start_before ? : string

  finish_before ? : string

  /** quick hack for category field__de */
  de ? : HtmlString
  en ? : HtmlString
  es ? : HtmlString


    // idea: quizAvgMs ?: DurationMs /* can be calculated via quizTotalMs / selfRatingsCount, but we store for querying purposes */
  // idea: quizTotalMs ?: DurationMs

  /* FIXME: this should not be optional */
  joinedSides ? () {
    // this seems very slow
    // const answerSides = this.getSidesWithAnswers()
    return sidesDefsArray.map(side => {

      const sideVal = this.getSideVal(side)
      if (! sideVal ) {
        return undefined
      }

      const substrLen = 1000
      const sideValForDisplay = /*answerSides.includes(side) ?*/ sideVal?.substring(0, substrLen) +
        (((sideVal?.length ?? 0) > substrLen) ? '...' : '')
        // : sideVal
      return sideValForDisplay
      // ● ⇨ ► ⇛
    }).filter(_ => !! _).join('<span style="color: var(--secondary)"> ⇶ </span>')
  }

  // getAnswers(): string[] {
  //   return this.getSidesWithAnswers().map(side => this.getSideVal(side))
  // }

  /** TODO: move to Quiz */
  public getSidesWithAnswers(): Side[] {
    const ret: Side [] = []
    let foundQuestionBefore = false
    for (let side of sidesDefsArray) {
      if ( side.isHint ) {
        continue
      }
      const sideVal = this.getSideVal(side)
      if (sideVal) {
        if ( !side.ask || foundQuestionBefore ) {
          ret.push(side)
        } else {
          foundQuestionBefore = true
          // do not push
        }
      }
    }
    return ret
  }

  /** TODO: move to Quiz */
  public getSidesWithHints(): Side[] {
    const ret: Side [] = []
    for (let side of sidesDefsHintsArray) {
      const sideVal = this.getSideVal(side)
      if ( sideVal ) {
        ret.push(side)
      }
    }
    return ret
  }

  public getSideVal(side ? : Side | nullish): string|undefined|null {
    if ( ! side ) {
      return null
    }
    return (this as any)[side.id] ?. trim ?. ()
  }

  /** TODO: move to Quiz */
  getQuestionOrAnyString() {
    const question = this.getQuestion()
    if ( question ) {
      return question
    }
    // second attempt, without `ask` requirement
  }

  /** TODO: move to Quiz */
  getQuestion(): SideVal {
    return this.getSideVal(this.getSideWithQuestion())
  }

  /** TODO: move to Quiz */
  getSideWithQuestionOrFirstNonEmpty(): Side | null {
    return this.getSideWithQuestion()
      ?? this.getFirstNonEmptySide()
  }

  getFirstNonEmptySide(): Side | null {
    for (let side of sidesDefsArray) {
      const sideVal = this.getSideVal(side)
      if (sideVal) {
        return side
      }
    }
    return null
  }

  hasQAndA(): boolean {
    // might be flaky
    // return true
    return (this.getSidesWithAnswers().length > 0) && !! this.getQuestion();
  }

  public needsProcessing(): boolean {
    return ! this.hasQAndA()
  }

  /** TODO: move to Quiz */
  public getSideWithQuestion(): Side | null {
    for (let side of sidesDefsArray) {
      if (side.ask) {
        const sideVal = this.getSideVal(side)
        if (sideVal) {
          return side
        }
      }
    }
    return null
  }

  matchesSearch(search: string) {
    search = (search || '').trim().toLowerCase()
    if ( search.length === 0 ) {
      return true
    }
    return sidesDefsArray.some(side => {
      const sideVal = this.getSideVal(side)?.replace(/<img src="data:image\/png;base64,.*"/gi, '')
      return sideVal && sideVal.toLowerCase().includes(search)
    })
  }

  getDurationEstimateMs() {
    return parseDurationToMs(stripHtml(this.time_estimate) ?. trim())
  }

  getDurationEstimateMinutes() {
    const parseDurationToMs1: number | null | undefined = parseDurationToMs(stripHtml(this.time_estimate) ?. trim())
    if ( parseDurationToMs1 ) {
      return parseDurationToMs1 / 60_000
    } else {
      return parseDurationToMs1
    }
  }

  /** TODO: ROI could also take into account mental effort (maybe even fun), money (as also if something is more expensive, the decision requires more mental effort, time;
   * more likely to get postponed */
  getRoi() {
    const durationEstimateMs = this.getDurationEstimateMs()
    if ( ! durationEstimateMs ) {
      return undefined
    }
    const importance = this.importance?.numeric
    if ( ! importance ) {
      return undefined
    }
    return importance / durationEstimateMs
  }


  /* NOTE: will apply to Learn too (e.g. to master certain material before/after some date, it will be prioritized). */
  getDeferrability(): Deferrability | nullish {
    const date = this.getNearestDateForUrgency()
    if ( date ) {
      const msNow = Date.now()
      const msDiff = date.getTime() - msNow
      return msDiff as Deferrability
      // overdue should have high urgency
    } else {
      return date
    }
  }

  getEffectiveDeferrability(): Deferrability {
    return this.getDeferrability()
      ?? ( daysAsMs(365) as Deferrability /* assuming we can do all stuff we entered in one year; unless specified as something more far away in time */ )
  }

  getNearestDateForUrgency(): Date | nullish {
    return this.getStartBeforeDate() ?? this.getFinishBeforeDate()
  }

  private getStartAfterDate(): Date | nullish {
    return parseDate(this.start_after)
  }

  getFinishBeforeDate(): Date | nullish {
    return parseDate(this.finish_before)
  }

  getStartBeforeDate(): Date | nullish {
    return parseDate(this.start_before)
  }

  getStatus(): StatusDef {
    const statusId = htmlToId(this.status)
    if ( isNotNullish(statusId) ) {
      const statusByKey = (statuses as any as Dict<StatusDef>) [ statusId ]
      if ( ! statusByKey ) {
        return statuses.unknown
      }
      return statusByKey
    } else {
      return statuses.undefined
    }
  }

  isMaybeDoableNow(): boolean | nullish {
    return isInThePastOrNullish(this.getStartAfterDate() ?. getTime())
      && (this.getStatus().isDoableNow ?? true /* since "maybe" */)
  }

}

export type LearnItemSidesVals = {[sideKey in keyof SidesDefs]: string}

export function field<T>(fieldName: keyof T) {
  return fieldName
}
