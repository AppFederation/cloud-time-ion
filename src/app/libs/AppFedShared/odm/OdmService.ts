import {Injector} from "@angular/core";
import {OdmBackend} from "./OdmBackend";
import {OdmItem} from "./OdmItem";
import {CachedSubject} from "../utils/CachedSubject";
import {debugLog, errorAlert} from "../utils/log";
import {OdmItemId} from "./OdmItemId";

export abstract class OdmService<T extends OdmItem<T>, TRaw extends OdmItem<T> = T> {

  throttleIntervalMs = 500
  // TODO: throttleLocalUiMs = 200
  throttleSaveToDbMs = 2000 /* NOTE: this does NOT apply to things like start/stop timer which bypass throttle */

  odmBackendFactory = this.injector.get(OdmBackend)
  odmCollectionBackend = this.odmBackendFactory.createCollectionBackend(this.injector, this.className)

  localItems$ = new CachedSubject<T[]>([])

  protected constructor(
    protected injector: Injector,
    public className: string,
  ) {
    this.setBackendListener()
    // this.subscribeToBackendCollection();
  }

  private subscribeToBackendCollection() {
    this.odmCollectionBackend.dbCollection$.subscribe(dbCol => {
      let convertedCol = dbCol.map(dbItem => {
        return this.convertFromDbFormat(dbItem)
      });
      const incomingNotKnownIfExisted = new Set<T>(convertedCol)
      const incomingItemsWhichAreNew = new Set<T>(convertedCol)
      const existingToDelete = new Set<T>(this.localItems$.lastVal)
      for (let incomingItemConverted of convertedCol) {
        let existingItem = this.getItemById(incomingItemConverted.id)
        if (existingItem) {
          existingToDelete.delete(existingItem) // it stays
          existingItem.applyDataFromDbAndEmit(incomingItemConverted)
          // Object.assign(existingItem, incomingItemConverted)
          existingItem.locallyVisibleChanges$.next(existingItem)
          incomingNotKnownIfExisted.delete(incomingItemConverted)
        } else {
          incomingItemsWhichAreNew.add(incomingItemConverted)
        }
      }
      for (let incomingItemToAdd of incomingItemsWhichAreNew) {
        this.localItems$.lastVal.push(incomingItemToAdd)
      }
      // this.localItems$.lastVal.push(Array.from(incomingItemsWhichAreNew))

      // FIXME: add new items to collection while leaving existing ones
      debugLog('localItems$.next')
      // this.localItems$.next(convertedCol)
      this.emitLocalItems()
      // FIXME: some item might need to be deleted
    })
  }

  deleteWithoutConfirmation(item: T) {
    this.odmCollectionBackend.deleteWithoutConfirmation(item.id)
  }

  saveNowToDb(itemToSave: T) {
    debugLog('saveNowToDb', itemToSave)
    this.odmCollectionBackend.saveNowToDb(itemToSave)
  }

  protected convertFromDbFormat(dbItem: TRaw): T {
    return dbItem as unknown as T // default impl
  }

  public getItemById(id: OdmItemId<T>) {
    // this.getById()
    return (
      this.localItems$.lastVal &&
      this.localItems$.lastVal.find(_ => _.id === id)
    )
  }

  private setBackendListener() {
    const service = this
    this.odmCollectionBackend.setListener({
      onAdded(addedItemId: OdmItemId<T>, newItemRawData: TRaw) {
        // debugLog('setBackendListener onAdded', ...arguments)
        let existingItem = service.getItemById(addedItemId)
        let items = service.localItems$.lastVal;
        if ( ! existingItem ) {
          existingItem = service.convertFromDbFormat(newItemRawData);
          items.push(existingItem)
        } else {
          errorAlert('onAdded item unexpectedly existed already: ' + addedItemId, existingItem, 'incoming data: ', newItemRawData)
          existingItem.applyDataFromDbAndEmit(service.convertFromDbFormat(newItemRawData))
        }
        service.emitLocalItems()
      },
      onModified(modifiedItemId: OdmItemId<T>, modifiedItemRawData: TRaw) {
        debugLog('setBackendListener onModified', ...arguments)
        let convertedItemData = service.convertFromDbFormat(modifiedItemRawData);
        let existingItem = service.getItemById(modifiedItemId)
        existingItem.applyDataFromDbAndEmit(convertedItemData)
        service.emitLocalItems()
      },
      onRemoved(removedItemId: OdmItemId<T>) {
        service.localItems$.lastVal = service.localItems$.lastVal.filter(item => item.id !== removedItemId)
        service.emitLocalItems()
      }
    })
  }

  emitLocalItems() {
    this.localItems$.next(this.localItems$.lastVal)
  }
}
