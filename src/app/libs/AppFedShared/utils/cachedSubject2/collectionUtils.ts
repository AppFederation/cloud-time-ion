import {nullish} from '../type-utils'
import {isNullish} from '../utils'

export type CompareFunc<T> = (o1: T, o2: T) => number

export type CompareFuncs<T> = Array<CompareFunc<T>>

export function compareByManyFuncs<T>(o1: T | nullish, o2: T, funcs: CompareFuncs<T>): number {
  if ( isNullish(o1) && ! isNullish(o2) ) {
    return 1
  }
  for (let func of funcs) {
    let funcRet = func(o1, o2)
    if ( funcRet !== 0 ) {
      return funcRet
    }
  }
  return 0
}

export function findPreferred<
  T,
  TPred extends (x: T) => boolean
    = (x: T) => boolean >
(
  collection: Array<T> | nullish,
  preconditionFunc: TPred,
  compareFuncs: CompareFuncs<T>,
) : T | undefined
{
  if ( ! collection ) {
    return undefined
  }
  let bestFound: T | undefined = undefined
  for ( const elem of collection ) {
    if ( preconditionFunc (elem) ) {
      const compareResult = compareByManyFuncs(bestFound, elem, compareFuncs)
      if ( compareResult > 0 ) {
        bestFound = elem
      }
      // if ( preferredConditionFunc(elem) ) {
      //   return elem // return immediately
      // }
      // found = elem // mark, but keep searching
    }
  }
  return bestFound
}
