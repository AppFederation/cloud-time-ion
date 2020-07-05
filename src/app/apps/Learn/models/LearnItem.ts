import {OdmItemId} from '../../../libs/AppFedShared/odm/OdmItemId'
import {OdmInMemItem, OdmItem$2} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {OdmBackend, OdmTimestamp} from '../../../libs/AppFedShared/odm/OdmBackend'
import {Side, SidesDefs, sidesDefsArray} from '../core/sidesDefs'
import {NumericPickerVal} from '../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'

export type LearnItemId = OdmItemId<LearnItem>
export type Rating = number


/** LearnDoItemData */
export class LearnItem extends OdmInMemItem {
  id?: LearnItemId
  whenAdded: OdmTimestamp
  title?: string
  isTask?: boolean
  hasAudio?: true | null
  whenDeleted?: Date
  lastSelfRating?: Rating
  whenLastSelfRated?: OdmTimestamp
  selfRatingsCount?: number

  joinedSides?() {
    // this seems very slow
    return sidesDefsArray.map(side => this.getSideVal(side)).filter(_ => _).join(' ● ')
  }

  getAnswers(): string[] {
    const ret: string [] = []
    let foundQuestionBefore = false
    for (let side of sidesDefsArray) {
      const sideVal = this.getSideVal(side)
      if ( sideVal ) {
        if (! side.ask || foundQuestionBefore) {
          ret.push(sideVal)
        } else {
          foundQuestionBefore = true
          // do not push
        }
      }
    }
    return ret
  }

  private getSideVal(side: Side) {
    return this[side.id] ?. trim ?. ()
  }

  getQuestionOrAnyString() {
    const question = this.getQuestion()
    if ( question ) {
      return question
    }
    // second attempt, without `ask` requirement
    for (let side of sidesDefsArray) {
      const sideVal = this.getSideVal(side)
      if (sideVal) {
        return sideVal
      }
    }

  }

  getQuestion() {
    for (let side of sidesDefsArray) {
      if (side.ask) {
        const sideVal = this.getSideVal(side)
        if (sideVal) {
          return sideVal
        }
      }
    }
  }
}

export type LearnItemSidesVals = {[sideKey in keyof SidesDefs]: string}

export class LearnItem$ extends OdmItem$2<LearnItem> {

  // TODO: operations should actually be performed on certain Version, for versioning, drafts, branches, conflict detection/resolution

  setNewSelfRating(newSelfRatingFromUser: NumericPickerVal) {
    const item = this.currentVal
    const previousRating = item.lastSelfRating
    let newEffectiveRating = newSelfRatingFromUser
    // repeatedly self-rating as 2 or 2.5, increases effective rating (confidence) :
    if ( newEffectiveRating >= 2 /* in case of 2.5 (click 2 times) */ && previousRating >= 2 ) {
      const enoughTimePassed = true // TODO: based on calculation
      if ( enoughTimePassed ) {
        newEffectiveRating = previousRating + 1
      }
    }

    this.patchThrottled({
      lastSelfRating: newEffectiveRating,
      whenLastSelfRated: OdmBackend.nowTimestamp(),
      selfRatingsCount: (item.selfRatingsCount || 0) + 1,
    })

  }
}

export function field<T>(fieldName: keyof T) {
  return fieldName
}
