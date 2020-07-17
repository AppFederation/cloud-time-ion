import {Injector} from "@angular/core";
import {OdmBackend} from "./OdmBackend";
import {debugLog} from "../utils/log";
import {OdmItemId} from "./OdmItemId";
import {SyncStatusService} from './sync-status.service'
import {OdmItem$2, OdmPatch} from './OdmItem$2'
import {assertTruthy} from '../utils/assertUtils'
import {CachedSubject} from '../utils/cachedSubject2/CachedSubject2'

export abstract class OdmService2<
  TSelf extends OdmService2<any, any, any, any> /* workaround coz I don't know how to get this in TS*/,
  TInMemData,
  TRawData, // = TInMemData,
  TOdmItem$ extends
    OdmItem$2<TOdmItem$, TInMemData, TRawData, TSelf /* (was any -> ) workaround for (indirectly) TS2716: Type parameter 'TOdmItem$' has a circular default. */>, // =
    // OdmItem$2<TInMemData, TRawData>,
  TItemId extends
    OdmItemId<TRawData> =
    OdmItemId<TRawData>,
  TMemPatch extends
    OdmPatch<TInMemData> =
    OdmPatch<TInMemData>,
  TRawPatch extends
    OdmPatch<TRawData> =
    OdmPatch<TRawData>,
  >
{

  throttleIntervalMs = 500
  // TODO: throttleLocalUiMs = 200
  throttleSaveToDbMs = 1000 /* NOTE: this does NOT apply to things like start/stop timer which bypass throttle */

  odmBackendFactory = this.injector.get(OdmBackend)
  odmCollectionBackend = this.odmBackendFactory.createCollectionBackend<TRawData>(this.injector, this.className)

  /** rename: item$s$ and consider items$ or itemVals$ for just values for perf.
     And itemsJustList$ for just changes of list, without reporting changes of individual item data-s
     */
  localItems$ = new CachedSubject<TOdmItem$[]>([])

  mapIdToItem$ = new Map<TItemId, TOdmItem$>()

  syncStatusService = this.injector.get(SyncStatusService)

  protected constructor(
    protected injector: Injector,
    public className: string,
  ) {
    this.setBackendListener()
    // this.subscribeToBackendCollection();
  }

  deleteWithoutConfirmation(item: TOdmItem$) {
    this.odmCollectionBackend.deleteWithoutConfirmation(item.id !)
  }

  saveNowToDb(itemToSave: TOdmItem$) {
    itemToSave.onModified()
    // debugLog('saveNowToDb', itemToSave)
    const dbFormat = itemToSave.toDbFormat()
    const promise = this.odmCollectionBackend.saveNowToDb(dbFormat, itemToSave.id !)
    this.syncStatusService.handleSavingPromise(promise)
  }

  public getItem$ById(id: TItemId): TOdmItem$ {
    assertTruthy(id, `id`)
    let item$ = this.mapIdToItem$.get(id)
    if ( ! item$ ) {
      item$ = this.createOdmItem$ForExisting(id)
      this.mapIdToItem$.set(id, item$)
    }
    return item$
  }

  private setBackendListener() {
    const service = this /* MUST use instead of `this` */
    this.odmCollectionBackend.setListener({
      onAdded(addedItemId: TItemId, addedItemRawData: TRawData) {
        let existingItem: TOdmItem$ = service.getItem$ById(addedItemId)
        // debugLog('setBackendListener onAdded', service, ...arguments, 'service.itemsCount()', service.itemsCount())

        // service.obtainOdmItem$(addedItemId) TODO

        let items = service.localItems$.lastVal;
        // if ( ! existingItem /* FIXME: now existingItem always returns smth */ ) {
        //   existingItem = service.createOdmItem$ForExisting(addedItemId, service.convertFromDbFormat(addedItemRawData))// service.convertFromDbFormat(addedItemRawData); // FIXME this.
        // }
          existingItem.applyDataFromDbAndEmit(service.convertFromDbFormat(addedItemRawData))
          items!.push(existingItem)
        // } else {
          // errorAlert('onAdded item unexpectedly existed already: ' + addedItemId, existingItem, 'incoming data: ', addedItemRawData)
          // existingItem.applyDataFromDbAndEmit(service.convertFromDbFormat(addedItemRawData))
        // }
        // service.emitLocalItems() -- now handled by onFinishedProcessingChangeSet
      },
      onModified(modifiedItemId: TItemId, modifiedItemRawData: TRawData) {
        // debugLog('setBackendListener onModified', ...arguments)
        let convertedItemData = service.convertFromDbFormat(modifiedItemRawData);
        let existingItem = service.getItem$ById(modifiedItemId)
        if ( existingItem && existingItem.applyDataFromDbAndEmit ) {
          existingItem.applyDataFromDbAndEmit(convertedItemData)
        } else {
          console.error('FIXME existingItem.applyDataFromDbAndEmit(convertedItemData)', existingItem, existingItem && existingItem.applyDataFromDbAndEmit)
        }
        // service.emitLocalItems() -- now handled by onFinishedProcessingChangeSet
      },
      onRemoved(removedItemId: TItemId) {
        service.localItems$.lastVal = service.localItems$ !. lastVal !. filter(item => item.id !== removedItemId)
        // TODO: remove from map? but keep in mind this could be based on query result. Maybe better to have a weak map and do NOT remove manually
        // service.emitLocalItems() -- now handled by onFinishedProcessingChangeSet
      },
      onFinishedProcessingChangeSet() {
        service.emitLocalItems()
      }

    })
  }

  /** Can be overridden by subclasses to provide specific sub-type */
  protected abstract createOdmItem$ForExisting(itemId: TItemId, inMemVal?: TInMemData): TOdmItem$ // {
  //   return new OdmItem$2(this, itemId, inMemVal) as TOdmItem$
  // }

  /** Can be overridden by subclasses to provide specific sub-type */
  newItem(id?: TItemId, inMemData?: TInMemData): TOdmItem$ {
    const odmItem$ = new OdmItem$2(this as any
      /* workaround for TS2716: Type parameter 'TOdmItem$' has a circular default. */
      , id, inMemData) as any as TOdmItem$
    return odmItem$
  }

  /** Can be overridden by subclasses to provide specific conversion */
  protected convertFromDbFormat(dbItem: TRawData): TInMemData {
    return dbItem as unknown as TInMemData // default impl
  }

  emitLocalItems() {
    this.localItems$.next(this.localItems$!.lastVal !)
  }

  itemsCount() {
    return this.mapIdToItem$.size
  }
}
