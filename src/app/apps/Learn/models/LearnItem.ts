import {OdmItemId} from '../../../libs/AppFedShared/odm/OdmItemId'
import {OdmInMemItem, OdmItem$2} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {OdmBackend, OdmTimestamp} from '../../../libs/AppFedShared/odm/OdmBackend'
import {sidesDefsArray} from '../core/sidesDefs'
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
    return sidesDefsArray.map(side => this[side.id]).filter(_ => _).join(' ● ')
  }

}

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
