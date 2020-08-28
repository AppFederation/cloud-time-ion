import {nullish} from '../type-utils'

export function findPreferred<
  T,
  TPred extends (x: T) => boolean
    = (x: T) => boolean >
(
  collection: Array<T> | nullish,
  preconditionFunc: TPred,
  preferredConditionFunc: TPred,
) : T | undefined
{
  if ( ! collection ) {
    return undefined
  }
  let found: T | undefined = undefined
  for ( const elem of collection ) {
    if ( preconditionFunc (elem) ) {
      if ( preferredConditionFunc(elem) ) {
        return elem // return immediately
      }
      found = elem // mark, but keep searching
    }
  }
  return found
}
