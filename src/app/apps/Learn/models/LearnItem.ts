import {OdmItemId} from '../../../libs/AppFedShared/odm/OdmItemId'
import {OdmInMemItem, OdmItem$2} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {OdmTimestamp} from '../../../libs/AppFedShared/odm/OdmBackend'
import {sidesDefsArray} from '../core/sidesDefs'

export type LearnItemId = OdmItemId<LearnItem>
export type Rating = number

// export class LearnDoItem$ extends OdmItem<LearnDoItem$, LearnItem> {
//
// }


/** LearnDoItemData */
export class LearnItem extends OdmInMemItem {
    id: LearnItemId
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
        return sidesDefsArray.map(side => this[side.id]).filter(_ => _).join(' | ')
    }

}

export class LearnItem$ extends OdmItem$2<LearnItem> {

}

export function field<T>(fieldName: keyof T) {
    return fieldName
}
