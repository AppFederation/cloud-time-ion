import {OdmItemId} from '../../../libs/AppFedShared/odm/OdmItemId'
import {OdmInMemItem} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {OdmTimestamp} from '../../../libs/AppFedShared/odm/OdmBackend'
import {Side, SidesDefs, sidesDefsArray, SideVal} from '../core/sidesDefs'
import {DurationMs, nullish} from '../../../libs/AppFedShared/utils/type-utils'

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
export class ImportanceDescriptors {
  off       = 0 // 0    BTN
  very_low  = 1 // 0.5
  low       = 2 // 1    BTN
  medium    = 5 // 1.5 // default when unspecified
  high      = 10 // 2   BTN
  very_high = 20 /* just 4 times more than unspecified?? --> 10 times?
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

  // idea: quizAvgMs ?: DurationMs /* can be calculated via quizTotalMs / selfRatingsCount, but we store for querying purposes */
  // idea: quizTotalMs ?: DurationMs

  /* FIXME: this should not be optional */
  joinedSides?() {
    // this seems very slow
    return sidesDefsArray.map(side => this.getSideVal(side)).filter(_ => _).join(' ● ')
  }

  // getAnswers(): string[] {
  //   return this.getSidesWithAnswers().map(side => this.getSideVal(side))
  // }

  public getSidesWithAnswers(): Side[] {
    const ret: Side [] = []
    let foundQuestionBefore = false
    for (let side of sidesDefsArray) {
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

  hasQAndA() {
    // might be flaky
    // return true
    return (this.getSidesWithAnswers().length > 0) && this.getQuestion();
  }

  public needsProcessing() {
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
}

export type LearnItemSidesVals = {[sideKey in keyof SidesDefs]: string}

export function field<T>(fieldName: keyof T) {
  return fieldName
}
