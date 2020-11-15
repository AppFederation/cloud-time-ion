import {Accessor, getByAccessor} from './getByAccessor'
import {incrementByPath} from './incrementByPath'

export function countByMulti<T>(coll: Iterable<T>, accessors: Array<Accessor<T, any>> ) {
  const ret = {}

  for ( const elem of coll) {
    const path = accessors.map(accessor => getByAccessor(elem, accessor))
    incrementByPath(ret, path)
  }
  return ret
}
