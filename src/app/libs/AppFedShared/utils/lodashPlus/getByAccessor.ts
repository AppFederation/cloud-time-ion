import {getByPath} from './getByPath'


export type Accessor<T, R> = (x: T) => R | (keyof T) | string[]

export function getByAccessor<T, R>(obj: T, acc: Accessor<T, R>) {
  if ( typeof acc === `string` ) {
    return obj[acc]
  } else if ( typeof acc === `function` ) {
    return acc(obj)
  } else {
    return getByPath(obj, acc)
  }
}
