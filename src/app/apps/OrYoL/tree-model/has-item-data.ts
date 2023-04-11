import {ItemId} from '../db/DbItem'

export type ItemData = any /* FIXME unify with ODM */

export interface HasItemData {

  getItemData(): ItemData | undefined

  getId(): ItemId
}

export interface HasPatchThrottled extends HasItemData {

  patchThrottled(patch: ItemData): void

}
