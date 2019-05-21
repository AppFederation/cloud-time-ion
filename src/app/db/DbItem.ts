import {
  DbItemClass,
  DbItemField,
} from './DbItemClass'

export type ItemId = string

export class DbItem {
  id: ItemId
  itemClass: DbItemClass
  itemData: any

  hasField(field: DbItemField) {
    return this.itemClass.hasField(field)
  }
}
