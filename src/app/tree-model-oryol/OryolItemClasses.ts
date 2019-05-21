import {
  itemClass,
  itemClasses,
} from '../db/DbItemClass'

/** attributes, properties, fields, slots */
export const ITEM_FIELDS = {
  estimatedTime: {},
  title: {}
}

export const ITEM_CLASSES = itemClasses({
  milestone: itemClass({
    fields: [ /* TODO: use map instead of array, and mapped type from class fields (at least form ODM, maybe not for OrYoL) */
      ITEM_FIELDS.estimatedTime,
      ITEM_FIELDS.title,
    ]
  }),
  dayPlan: itemClass({
    fields: [
      ITEM_FIELDS.estimatedTime,
      ITEM_FIELDS.title,
    ]
  }),
  task: itemClass({
    fields: [
      ITEM_FIELDS.estimatedTime,
      ITEM_FIELDS.title,
    ]
  }),
  note: itemClass({
    fields: [
      ITEM_FIELDS.title,
    ]
  }),
  bullet: itemClass({
    fields: [
      ITEM_FIELDS.title,
    ]
  }),
  policy: itemClass({
    fields: [
      ITEM_FIELDS.title,
    ]
  }),
})
