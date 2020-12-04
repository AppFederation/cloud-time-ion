import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'

export class SelectionManager<T = any> {

  selected = new Set<T>()

  selected$ = new CachedSubject<Set<T>>()

  setSelected(x: T, selected: boolean) {
    console.log(`setSelected`, selected)
    if ( selected ) {
      this.selected.add(x)
    } else {
      this.selected.delete(x)
    }
    this.selected$.nextWithCache(this.selected)
  }
}
