import {Injector} from "@angular/core";
import {OdmBackend} from "../OdmBackend";
import {OdmItem} from "../OdmItem";
import {CachedSubject} from "../../utils/CachedSubject";
import {debugLog, errorAlert} from "../../utils/log";
import {OdmItemId} from "../OdmItemId";
import {OdmItemHandle} from './OdmItemHandle'
import {OdmItemSnapshot} from './OdmItemSnapshot'

/* TODO: rename to OdmCollectionService? As OdmService suggests smth global */
export abstract class OdmCollectionService2<
  TRamItem,
  TDbData = TRamItem,
  THandle = OdmItemHandle<TRamItem, TDbData>,
  // TSnap = OdmItemSnapshot<TInMemData>,
  >
{
  // public type x = string
  throttleIntervalMs = 500
  // TODO: throttleLocalUiMs = 200
  throttleSaveToDbMs = 1000 /* NOTE: this does NOT apply to things like start/stop timer which bypass throttle */

  odmBackendFactory = this.injector.get(OdmBackend)
  odmCollectionBackend = this.odmBackendFactory.createCollectionBackend(this.injector, this.className)

  /* Rename to itemsArr$ ? */
  localItems$ = new CachedSubject<TRamItem[]>([])

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
      const incomingNotKnownIfExisted = new Set<TRamItem>(convertedCol)
      const incomingItemsWhichAreNew = new Set<TRamItem>(convertedCol)
      const existingToDelete = new Set<TRamItem>(this.localItems$.lastVal)
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

  // deleteWithoutConfirmation(item: T) {
  //   this.odmCollectionBackend.deleteWithoutConfirmation(item.id)
  // }

  saveNowToDb(handle: THandle, itemToSave: TRamItem) {
    debugLog('saveNowToDb', itemToSave)
    this.odmCollectionBackend.saveNowToDb(itemToSave, handle.itemId)
  }

  protected convertFromDbFormat(dbItem: TDbData): TRamItem {
    return dbItem as any as TRamItem // default impl
  }

  public getItemById(id: OdmItemId<TRamItem>) {
    // this.getById()
    return (
      this.localItems$.lastVal &&
      this.localItems$.lastVal.find(_ => _.id === id)
    )
  }

  private setBackendListener() {
    const service = this
    this.odmCollectionBackend.setListener({
      onAdded(addedItemId: OdmItemId<TRamItem>, newItemRawData: TDbData) {
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
      onModified(modifiedItemId: OdmItemId<TRamItem>, modifiedItemRawData: TDbData) {
        debugLog('setBackendListener onModified', ...arguments)
        let convertedItemData = service.convertFromDbFormat(modifiedItemRawData);
        let existingItem = service.getItemById(modifiedItemId)
        if ( existingItem.applyDataFromDbAndEmit ) {
          existingItem.applyDataFromDbAndEmit(convertedItemData)
        } else {
          console.error('FIXME existingItem.applyDataFromDbAndEmit(convertedItemData)', existingItem.applyDataFromDbAndEmit)
        }
        service.emitLocalItems()
      },
      onRemoved(removedItemId: OdmItemId<TRamItem>) {
        service.localItems$.lastVal = service.localItems$.lastVal.filter(item => item.id !== removedItemId)
        service.emitLocalItems()
      }
    })
  }

  emitLocalItems() {
    this.localItems$.next(this.localItems$.lastVal)
  }
}
