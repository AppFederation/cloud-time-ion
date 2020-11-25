import {OdmItemId} from '../../../libs/AppFedShared/odm/OdmItemId'
import {OdmInMemItem} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {OdmTimestamp} from '../../../libs/AppFedShared/odm/OdmBackend'
import {Side, SidesDefs, sidesDefsArray, sidesDefsHintsArray, SideVal} from '../core/sidesDefs'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {Rating} from './fields/self-rating.model'
import {ImportanceDescriptors} from './fields/importance.model'
import {stripHtml} from '../../../libs/AppFedShared/utils/html-utils'
import {parseDurationToMs} from '../../../libs/AppFedShared/utils/time/parse-duration'
import {QuizzableData} from './quiz'
import {FunDescriptors} from './fields/fun-level.model'
import {MentalEffortLevelDescriptors} from './fields/mental-effort-level.model'

export type LearnItemId = OdmItemId<LearnItem>

export type PositiveInt = number

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
  hasAudio?: true | null
  whenDeleted?: Date
  lastSelfRating?: Rating
  whenLastSelfRated?: OdmTimestamp

  // isMarkedAsSelectedOrUnselected ? : boolean
  isSelectedOrUnselected ? : boolean


  selfRatingsCount?: PositiveInt

  /** synonyms: worth
   * storing both name and numeric value, in case it changes in the future
   */
  importance ? : ImportanceVal

  funEstimate ? : FunVal

  mentalLevelEstimate ? : MentalLevelVal

  /** keep in mind also: time-boxing */
  time_estimate ? : HtmlString

  money_estimate ? : HtmlString

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

  getQuestionOrAnyString() {
    const question = this.getQuestion()
    if ( question ) {
      return question
    }
    // second attempt, without `ask` requirement
  }

  getQuestion(): SideVal {
    return this.getSideVal(this.getSideWithQuestion())
  }

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
}

export type LearnItemSidesVals = {[sideKey in keyof SidesDefs]: string}

export function field<T>(fieldName: keyof T) {
  return fieldName
}
