import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'

export class SelectionManager<T = any> {

  public isSelectionActive = false

  private isAllSelected = false

  get selected() { return this.selected$.lastVal as Set<T> }

  selected$ = new CachedSubject<Set<T>>(new Set<T>())

  effectiveSelectedCount$ = new CachedSubject<number>(0)

  effectiveSelectionChange$ = new CachedSubject<void>()

  isAllEffectivelySelected$ = new CachedSubject<boolean>(false)

  allPossibleToSelect: T[] = []

  setAllSelected(selected: boolean) {
    this.isAllSelected = selected
    // this.selected$.nextWithCache()
    this.emitEffective()
  }

  private emitEffective() {
    this.effectiveSelectedCount$.nextWithCache(this.getEffectiveSelectedCount())
    this.effectiveSelectionChange$.nextWithCache()
  }

  private getEffectiveSelectedCount(): number {
    return this.isAllSelected ?
      this.allPossibleToSelect.length
      : this.selected.size
  }

  setSelected(x: T, selected: boolean) {
    // console.log(`setSelected`, selected)
    if ( selected ) {
      this.selected.add(x)
    } else {
      this.selected.delete(x)
    }
    this.selected$.nextWithCache(this.selected)
    this.emitEffective()
  }

  unselectAll() {
    this.selected$.nextWithCache(new Set<T>())
    this.emitEffective()
  }

  /** or "Specifically" */
  isExplicitlySelected(x: T) {
    return this.selected.has(x)
  }

  isEffectivelySelected(x: T) {
    return this.isAllSelected || this.isExplicitlySelected(x)
  }

  setAllPossibleToSelect(x: T[]) {
    this.allPossibleToSelect = x
    this.emitEffective()
  }

  getEffectivelySelected(): T[] {
    if ( this.isAllSelected ) {
      return this.allPossibleToSelect
    } else {
      return Array.from(this.selected)
    }
  }
}
