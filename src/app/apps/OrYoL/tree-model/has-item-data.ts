import {ItemId} from '../db/OryItem$'

export type ItemData = any /* FIXME unify with ODM */

export interface HasItemData {

  getItemData(): ItemData | undefined

  getId(): ItemId
}

export interface HasPatchThrottled extends HasItemData {

  patchThrottled(patch: ItemData): void

}
