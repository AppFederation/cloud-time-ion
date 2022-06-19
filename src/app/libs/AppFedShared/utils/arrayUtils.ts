export function lastItemOrUndefined<T>(arr: T[] | undefined) {
  if ( ! arr ) {
    return undefined
  }
  return (arr ?.length > 0)
    ? arr[arr.length - 1]
    : undefined
}
