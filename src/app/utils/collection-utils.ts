export function count<T>(array: T[], predicate: ((_: T) => boolean)): number {
  if ( ! array ) {
    return 0
  }
  let counter = 0
  for ( let elem of array ) {
    if ( predicate(elem) ) {
      ++counter
    }
  }
  return counter
}
