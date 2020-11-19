import {isNullish} from '../utils'

export function getByPath(obj: any, path: string[]): any {
  let subObj = obj
  for ( let curKey of path ) {
    let newSubObj = subObj[curKey]
    if ( isNullish(newSubObj) ) {
      return newSubObj /* maybe undefined ; should probably match ?. operator */
    }
    subObj = newSubObj
  }
  return subObj
}
