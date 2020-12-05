import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'

export class SelectionManager<T = any> {

  get selected() { return this.selected$.lastVal as Set<T> }

  selected$ = new CachedSubject<Set<T>>(new Set<T>())

  setSelected(x: T, selected: boolean) {
    console.log(`setSelected`, selected)
    if ( selected ) {
      this.selected.add(x)
    } else {
      this.selected.delete(x)
    }
    this.selected$.nextWithCache(this.selected)
  }

  unselectAll() {
    this.selected$.nextWithCache(new Set<T>())
  }

  isSelected(x: T) {
    return this.selected.has(x)
  }
}
