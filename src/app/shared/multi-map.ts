import { nullOrUndef } from './utils'

export class MultiMap<K, V> {
  map = new Map<K, V[]>()

  add(key: K, val: V) {
    this.checkKey(key)
    let coll = this.map.get(key)
    if ( ! coll ) {
      coll = []
      this.map.set(key, coll)
    }
    if ( ! coll.includes(val) ) {
      coll.push(val)
    }
  }

  private checkKey(key: K) {
    if (nullOrUndef(key)) {
      throw new Error('Invalid key ' + key)
    }
  }

  get(key: K) {
    return this.map.get(key);
  }

  get keyCount() {
    return this.map.size
  }
}
