/** TODO consider template strings */
export type IdString = string & {type: 'id'}

/** TODO: IdString
 * FIXME: unify with ItemId
 * */
export type OdmItemId<T = any> = string
