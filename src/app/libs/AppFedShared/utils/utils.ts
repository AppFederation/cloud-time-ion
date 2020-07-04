export function countBy2<T>(arr: T[], conditionFn: (item: T) => boolean): number {
  let count = 0
  for ( let item of arr ) {
    if ( conditionFn(item) ) {
      count ++
    }
  }
  return count
}

export function isNotNullish(x) {
  return x !== null && x !== undefined
}

export function countNotNullishBy<T>(arr: T[], getterFn: (item: T) => any): number {
  return countBy2(arr, item => isNotNullish(getterFn(item)))
}