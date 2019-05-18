import {Injector} from "@angular/core";
import {OdmBackend} from "./OdmBackend";
import {OdmItem} from "./OdmItem";
import {CachedSubject} from "../utils/CachedSubject";
import {debugLog} from "../utils/log";
import {OdmItemId} from "./OdmItemId";

export abstract class OdmService<T extends OdmItem<T>> {

  throttleIntervalMs = 500
  // TODO: throttleLocalUiMs = 200
  // TODO: throttleSaveToDbMs = 1000 /* NOTE: this does NOT apply to things like start/stop timer which bypass throttle */

  odmBackendFactory = this.injector.get(OdmBackend)
  odmCollectionBackend = this.odmBackendFactory.createCollectionBackend(this.injector, this.className)

  localItems$ = new CachedSubject<T[]>([])

  protected constructor(
    protected injector: Injector,
    public className: string,
  ) {
    this.odmCollectionBackend.dbCollection$.subscribe(dbCol => {
      let convertedCol = dbCol.map(dbItem => {
        return this.convertFromDbFormat(dbItem)
      });
      const incomingNotKnownIfExisted = new Set<T>(convertedCol)
      const incomingItemsWhichAreNew = new Set<T>(convertedCol)
      const existingToDelete = new Set<T>(this.localItems$.lastVal)
      for ( let incomingItemConverted of convertedCol ) {
        let existingItem = this.getById(incomingItemConverted.id)
        if ( existingItem ) {
          existingToDelete.delete(existingItem) // it stays
          Object.assign(existingItem, incomingItemConverted)
          existingItem.localChanges$.next(existingItem)
          incomingNotKnownIfExisted.delete(incomingItemConverted)
        } else {
          incomingItemsWhichAreNew.add(incomingItemConverted)
        }
      }
      for ( let incomingItemToAdd of incomingItemsWhichAreNew) {
        this.localItems$.lastVal.push(incomingItemToAdd)
      }
      // this.localItems$.lastVal.push(Array.from(incomingItemsWhichAreNew))

      // FIXME: add new items to collection while leaving existing ones
      debugLog('localItems$.next')
      // this.localItems$.next(convertedCol)
      this.localItems$.next(this.localItems$.lastVal) // FIXME: some item might need to be deleted
    })
  }

  deleteWithoutConfirmation(item: T) {
    this.odmCollectionBackend.deleteWithoutConfirmation(item.id)
  }

  saveNow(item: T) {
    this.odmCollectionBackend.saveNow(item)
  }

  protected convertFromDbFormat(dbItem: T) {
    return dbItem // default impl
  }

  public getById(id: OdmItemId<T>) {
    // this.getById()
    return (
      this.localItems$.lastVal &&
      this.localItems$.lastVal.find(_ => _.id === id)
    )
  }
}
