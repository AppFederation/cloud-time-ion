/** TODO: rename to countIf or countWhere ?
 * Lodash's countBy is more like groupCountBy (grouping)
 */
import {appGlobals} from '../g'

export function countBy2<T>(arr: Iterable<T>, conditionFn: (item: T) => boolean): number {
  let count = 0
  let totalCount = 0
  for ( let item of arr ) {
    totalCount++
    if ( conditionFn(item) ) {
      count ++
    }
  }
  if ( appGlobals.feat.showPerformanceTracking ) {
    console.log('countBy2, totalCount', totalCount)
  }

  return count
}

/** minimums per group
 * numeric value is stored, as groupByFn() call might be costly (e.g. getEffectiveImportanceNumeric - might involve going over categories)
 * */
export function minsGroupBy<TItem, TGroup>(
  iterable: Iterable<TItem>,
  numFn: (item: TItem) => number,
  groupByFn: (item: TItem) => TGroup
): Map<TGroup, [number, TItem]>
{
  const retMap = new Map<TGroup, [number, TItem]> ()
  for ( let item of iterable ) {
    const num = numFn(item)
    const grp = groupByFn(item)
    const currMin = retMap.get(grp)
    if ( currMin === undefined || num < currMin[0] ) {
      retMap.set(grp, [num, item])
    }
  }
  return retMap
}

export function isNotNullish<T>(x: T)
  : x is NonNullable<T>
{
  return (x !== null) && (x !== undefined)
}

export function isNullish(x: any)
    : x is (null | undefined)
{
  return (x === null) || (x === undefined)
}

export function isNullishOrEmptyOrBlank(x: any): boolean {
  return ( x === null ) || ( x === undefined ) || ! ( x ?. trim() ?. length )
}

export function isNotNullishOrEmptyOrBlank<T>(x: T)
    : x is NonNullable<T>
{
  return ! isNullishOrEmptyOrBlank(x)
}

export function countNotNullishBy<T>(arr: T[], getterFn: (item: T) => any): number {
  return countBy2(arr, item => isNotNullish(getterFn(item)))
}
