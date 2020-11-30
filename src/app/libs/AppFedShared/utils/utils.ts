
/** TODO: rename to countIf or countWhere ?
 * Lodash's countBy is more like groupCountBy (grouping)
 */
export function countBy2<T>(arr: T[], conditionFn: (item: T) => boolean): number {
  let count = 0
  for ( let item of arr ) {
    if ( conditionFn(item) ) {
      count ++
    }
  }
  return count
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

export function isNullishOrEmptyOrBlank(x: any) {
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
