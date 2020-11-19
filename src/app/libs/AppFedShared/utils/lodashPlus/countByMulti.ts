import {Accessor, getByAccessor} from './getByAccessor'
import {incrementByPath} from './incrementByPath'

export function countByMulti<T>(coll: Iterable<T>, accessors: Array<[string, Accessor<T, any>]> ) {
  const ret = {}

  for ( const elem of coll) {
    const path = accessors.map(accessor => getByAccessor(elem, accessor[1]))
    incrementByPath(ret, path)
  }
  return ret
}
