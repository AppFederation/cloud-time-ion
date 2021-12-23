import {OdmItemId} from '../odm/OdmItemId'
import {OdmInMemItem} from '../odm/OdmItem$2'
import {OdmTimestamp} from '../odm/OdmBackend'

export type GenericItemId = OdmItemId<GenericItem>

export class GenericItem extends OdmInMemItem {

  id?: GenericItem
  whenAdded ! : OdmTimestamp
  title?: string
  whenDeleted?: Date
  isSelectedOrUnselected ? : boolean

}
