import {sumBy} from 'lodash';

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

export function sumRecursively<TNode>(
    root: TNode,
    childrenGetter: (parent: TNode) => TNode[],
    valGetter: (item: TNode) => number
) {
  const children = childrenGetter(root)
  const rootVal = valGetter(root)
  const sumVal = sumBy(children, child => sumRecursively(child, childrenGetter, valGetter))
  return rootVal + sumVal
}
