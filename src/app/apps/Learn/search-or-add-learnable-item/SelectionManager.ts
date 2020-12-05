import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'

export class SelectionManager<T = any> {

  private isAllSelected: boolean

  get selected() { return this.selected$.lastVal as Set<T> }

  selected$ = new CachedSubject<Set<T>>(new Set<T>())

  effectiveSelectedCount$ = new CachedSubject<number>(0)

  effectiveSelectionChange$ = new CachedSubject<void>()

  isAllEffectivelySelected$ = new CachedSubject<boolean>(false)

  allPossibleToSelect = []

  setAllSelected(selected: boolean) {
    this.isAllSelected = selected
    // this.selected$.nextWithCache()
    this.effectiveSelectedCount$.nextWithCache(this.allPossibleToSelect.length)
    this.effectiveSelectionChange$.nextWithCache()
  }

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
    this.effectiveSelectionChange$.nextWithCache()
  }

  /** or "Specifically" */
  isExplicitlySelected(x: T) {
    return this.selected.has(x)
  }

  isEffectivelySelected(x: T) {
    return this.isAllSelected || this.isExplicitlySelected(x)
  }
}
