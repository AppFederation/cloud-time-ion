import {ItemId} from '../db/OryItem$'

export type ItemData = any /* FIXME unify with ODM */

export interface HasItemData<TJsVal> {

  getItemData(): ItemData | undefined

  getId(): ItemId
}

/** This is super close to be OdmItem$ */
export interface HasPatchThrottled<TJsVal> extends HasItemData<TJsVal> {

  patchThrottled(patch: Partial<ItemData>): void

}
