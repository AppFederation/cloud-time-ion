import {OdmItemId} from '../../../libs/AppFedShared/odm/OdmItemId'
import {OdmInMemItem} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {OdmTimestamp} from '../../../libs/AppFedShared/odm/OdmBackend'
import {Side, SidesDefs, sidesDefsArray, sidesDefsHintsArray, SideVal} from '../core/sidesDefs'
import {DurationMs, nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {Dict, dictToArrayWithIds} from '../../../libs/AppFedShared/utils/dictionary-utils'

export type LearnItemId = OdmItemId<LearnItem>
export type Rating = number

export class SelfRatingDescriptors {
  none = 0
  little = 0.5 // or "bad"
  decent = 1
  good = 1.5
  very_good = 2.0
  obvious = 3 // or 2.5
}

/* Note: importance, not priority; priority is calculated based on other factors like estimations, deadlines, free time, FUN, etc. */
export class ImportanceDescriptors implements Dict<any> {
  /* unset -> null; for querying */
  off       = /* impDesc(*/ {numeric: 0, abbrev: `Off`} // 0    BTN
  extremely_low  = {numeric: 0.5, abbrev: `XLP`} // this is better than off, coz it might re-occur at some point if I have a lot of time for learning, so I don't forget about it.
  very_low  = {numeric: 1, abbrev: `VLP`} // 0.5
  low       = {numeric: 2, abbrev: `LoP`} // 1    BTN
  // somewhat / a bit low; SLP
  somewhat_low = {numeric: 4, abbrev: `SLP`}
  /* default between low and medium ? somewhat low? */
  medium    = /* impDesc(*/ {numeric: 5, abbrev: `MdP`, id: `medium` /* hack */} // 1.5 // default when unspecified;  { should medium have a BTN? --> yes, coz we wanna be able to say that something was already manually deliberately prioritized; vs not prioritized yet (not prioritized could be also shown by "Process" btn maybe; or at least uncategorised ones)
  // somewhat / a bit high; darkened up-chevron; SHP
  somewhat_high = {numeric: 7, abbrev: `SHP`}
  high      = {numeric: 10, abbrev: `HiP`} // 2   BTN
  very_high = {numeric: 20, abbrev: `VHP`} /* just 4 times more than unspecified?? --> 10 times?
   /* just 4 times more than unspecified?? --> 10 times?
      20 times higher than very_low seems ok
   */ // 2.5 / 3
  extremely_high = {numeric: 40, abbrev: `XHP`}
  // it gives 10 level total now

  // Icons: up arrow (chevron), double up arrow, etc., medium: wavy, or flat line, or {up&down (but smth visually simple might be better)
}

export const importanceDescriptors = new ImportanceDescriptors()

export const importanceDescriptorsArray = dictToArrayWithIds(importanceDescriptors as Dict<any>)

export const importanceDescriptorsArrayFromHighest = importanceDescriptorsArray.slice().reverse()

export class FunDescriptors {
  disgusting        = 0 // 0    BTN
  very_low          = 1 // 0.5
  low               = 2 // 1    BTN
  medium            = 5 // 1.5 // default when unspecified
  high              = 10 // 2   BTN
  very_high/*fun*/   = 20 /* just 4 times more than unspecified?? --> 10 times?
      20 times higher than very_low seems ok
   */ // 2.5 / 3
}


/** LearnDoItemData */
export class LearnItem extends OdmInMemItem {
  id?: LearnItemId
  whenAdded ! : OdmTimestamp
  title?: string
  isTask?: boolean
  hasAudio?: true | null
  whenDeleted?: Date
  lastSelfRating?: Rating
  whenLastSelfRated?: OdmTimestamp


  selfRatingsCount?: number

  /** synonyms: worth
   * storing both name and numeric value, in case it changes in the future
   */
  importance? : {
    id: keyof ImportanceDescriptors,
    numeric: number,
  }

  // idea: quizAvgMs ?: DurationMs /* can be calculated via quizTotalMs / selfRatingsCount, but we store for querying purposes */
  // idea: quizTotalMs ?: DurationMs

  /* FIXME: this should not be optional */
  joinedSides?() {
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
    }).filter(_ => !! _).join(' ● ')
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

  public getSideVal(side?: Side | nullish): string|undefined|null {
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
}

export type LearnItemSidesVals = {[sideKey in keyof SidesDefs]: string}

export function field<T>(fieldName: keyof T) {
  return fieldName
}
