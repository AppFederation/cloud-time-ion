import {getByPath} from './getByPath'


export type Accessor<T, TRet> = (x: T) => TRet | (keyof T) | string[]

export function getByAccessor<T, R>(obj: T, acc: Accessor<T, R>) {
  if ( typeof acc === `string` ) {
    // path with dots will be here too
    return obj[acc]
  } else if ( typeof acc === `function` ) {
    return acc(obj)
  } else {
    return getByPath(obj, acc)
  }
}
