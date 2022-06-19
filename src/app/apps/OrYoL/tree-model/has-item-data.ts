import {ItemId} from '../db/DbItem'

export type ItemData = any /* FIXME unify with ODM */

export interface HasItemData {
  patchItemData(itemData: ItemData): void

  getItemData(): ItemData | undefined

  getId(): ItemId
}
