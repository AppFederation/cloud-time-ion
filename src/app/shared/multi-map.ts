export class MultiMap<K, V> {
  map = new Map<K, V[]>()

  add(key: K, val: V) {
    let coll = this.map.get(key)
    if ( ! coll ) {
      coll = []
      this.map.set(key, coll)
    }
    coll.push(val)
  }
}
