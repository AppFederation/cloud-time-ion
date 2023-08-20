import {OdmItem$2} from './OdmItem$2'
import {CachedSubject} from '../utils/cachedSubject2/CachedSubject2'
import {BehaviorSubject} from 'rxjs'

/** FIXME check what sync status component uses */
export type TOdmListStatus = {}

/** To consider:
  * - GlazedLists
 * - extract ReadOnlyList$
 * */
export class OdmList$<TItem$ extends OdmItem$2<any, any, any, any>> {
  /** only list changes, not values changes */
  readonly list$ = new BehaviorSubject<TItem$[] /*  | undefined - no undefined, to reduce errors; not-loaded is in status$ */>([])


  status$: BehaviorSubject<TOdmListStatus> = new BehaviorSubject<{  }>({})

  /** add to collection; e.g. a child to a parent; a task to a milestone*/
  add(itemToAdd: TItem$) {
    const newList = this.list$.value
    newList.push(itemToAdd)
    this.list$.next(newList)
    // allowing duplicates could be a config option in this class (and what happens on adding duplicate - move to last position or leave as-was)
  }
}
