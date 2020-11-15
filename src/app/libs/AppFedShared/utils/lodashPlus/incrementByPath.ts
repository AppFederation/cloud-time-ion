declare global {
  interface Array<T> {
    last() : T;
  }
}

Array.prototype.last ??= function (this : string) {
  return this[this.length - 1]
};


export function incrementByPath(obj: any, path: string[]): any {
  let subObj = obj
  for ( let i = 0; i < path.length - 1; ++i ) {
    let curKey = path[i]
    let newSubObj = subObj[curKey]
    // put-if-absent:
    if ( ! newSubObj ) {
      newSubObj = {}
      subObj[curKey] = newSubObj
    }
    subObj = newSubObj
  }
  const lastKey = path.last()
  const numVal = subObj[lastKey] ?? 0
  subObj[lastKey] = numVal + 1
  return obj
}
