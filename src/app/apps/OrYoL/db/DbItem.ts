import {
  DbItemClass,
  DbItemField,
} from './DbItemClass'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'

export type ItemId = string

export type NodeInclusionId = string

export class DbItem<TData = any> {

  constructor(
    public id: ItemId
  ) {
  }

  data$ = new CachedSubject<TData>()

  itemClass?: DbItemClass
  itemData?: any

  hasField(field: DbItemField) {
    return !!this.itemClass?.hasField?.(field)
  }
}
