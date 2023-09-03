import {Injector} from "@angular/core";
import {OdmBackend} from "./OdmBackend";
import {OdmItem__OLD__} from "./OdmItem__OLD__";
// import {CachedSubjectBugged} from "../utils/CachedSubjectBugged";
import {debugLog, errorAlert} from "../utils/log";
import {OdmItemId} from "./OdmItemId";
import {SyncStatusService} from './sync-status.service'
import {Observable} from 'rxjs'
import {CachedSubject} from '../utils/cachedSubject2/CachedSubject2'

export abstract class OdmService_OLD<
  T extends OdmItem__OLD__<T>,
  TRaw = T /* TODO: no longer = T */,
  // TOdmItem$ extends T /*OdmItem<T>*/ = T
  >
{

  throttleIntervalMs = 500
  // TODO: throttleLocalUiMs = 200
  throttleSaveToDbMs = 1000 /* NOTE: this does NOT apply to things like start/stop timer which bypass throttle */

  odmBackendFactory = this.injector.get(OdmBackend)
  odmCollectionBackend = this.odmBackendFactory.createCollectionBackend<TRaw>(this.injector, this.className, {dontStoreVersionHistory: false})

  localItems$ = new CachedSubject<T[]>([])

  syncStatusService = this.injector.get(SyncStatusService)

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
        let existingItem = this.getItemById(incomingItemConverted.id !)
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
        this.localItems$ !. lastVal !. push(incomingItemToAdd)
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
    this.odmCollectionBackend.deleteWithoutConfirmation(item.id !)
  }

  saveNowToDb(itemToSave: T) {
    itemToSave.onModified()
    debugLog('saveNowToDb', itemToSave)
    console.log("NOT SAVING")
    // const promise = this.odmCollectionBackend.saveNowToDb(itemToSave.toDbFormat() as any as TRaw /* TODO check type */, itemToSave.id !)
    // this.syncStatusService.handleSavingPromise(promise)
  }

  protected convertFromDbFormat(dbItem: TRaw): T {
    return dbItem as unknown as T // default impl
  }

  public getItemById(id: OdmItemId<T>) {
    return (
      this.localItems$.lastVal &&
      this.localItems$.lastVal.find(_ => _.id === id)
    )
  }

  private setBackendListener() {
    const service = this
    // debugLog(`BEFORE this.odmCollectionBackend.setListener({`, service.className)
    this.odmCollectionBackend.setListener({
      // This could cause the race condition of items uninitialized when going from another route
      onAdded(addedItemId: OdmItemId<T>, newItemRawData: TRaw) {
        // debugLog(`in onAdded: this.odmCollectionBackend.setListener({`, service.className)

        // debugLog('setBackendListener onAdded', ...arguments)
        let existingItem = service.getItemById(addedItemId)
        let items = service.localItems$.lastVal;
        if ( ! existingItem ) {
          existingItem = service.convertFromDbFormat(newItemRawData);
          items !. push(existingItem)
        } else {
          errorAlert('onAdded item unexpectedly existed already: ' + addedItemId, existingItem, 'incoming data: ', newItemRawData)
          existingItem.applyDataFromDbAndEmit(service.convertFromDbFormat(newItemRawData))
        }
        service.emitLocalItems()
      },
      onModified(modifiedItemId: OdmItemId<T>, modifiedItemRawData: TRaw) {
        // debugLog('setBackendListener onModified', ...arguments)
        let convertedItemData = service.convertFromDbFormat(modifiedItemRawData);
        let existingItem = service.getItemById(modifiedItemId)
        if ( existingItem && existingItem.applyDataFromDbAndEmit ) {
          existingItem.applyDataFromDbAndEmit(convertedItemData)
        } else {
          console.error('FIXME existingItem.applyDataFromDbAndEmit(convertedItemData)', existingItem, existingItem && existingItem.applyDataFromDbAndEmit)
        }
        service.emitLocalItems()
      },
      onRemoved(removedItemId: OdmItemId<T>) {
        service.localItems$.lastVal = service.localItems$!.lastVal!.filter(item => item.id !== removedItemId)
        service.emitLocalItems()
      },
      onFinishedProcessingChangeSet() {
        // nothing in v1
      }
    }, 0, () => {})
  }

  emitLocalItems() {
    this.localItems$.next(this.localItems$ !.lastVal !)
  }
}
