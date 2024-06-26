import {sumBy} from 'lodash-es';

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

export function sumRecursivelyIncludingRoot<TNode, TChildNode extends TNode>(
  root: TNode,
  childrenGetter: (parent: TNode) => TChildNode[],
  valGetter: (item: TNode) => number
): number {
  const rootVal = valGetter(root)
  return rootVal + sumRecursivelyJustChildren(root, childrenGetter, valGetter)
}

export function sumRecursivelyJustChildren<TNode, TChildNode extends TNode>(
    root: TNode,
    childrenGetter: (parent: TNode) => TChildNode[],
    valGetter: (item: TChildNode) => number
): number {
  const children = childrenGetter(root)
  const sumVal = sumBy(children, child => sumRecursivelyIncludingRoot(child, childrenGetter, valGetter))
  return sumVal
}
