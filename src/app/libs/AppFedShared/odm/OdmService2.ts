import {Injector} from "@angular/core";
import {OdmBackend} from "./OdmBackend";
import {debugLog} from "../utils/log";
import {OdmItemId} from "./OdmItemId";
import {SyncStatusService} from './sync-status.service'
import {OdmItem$2, OdmPatch, ModificationOpts} from './OdmItem$2'
import {assertTruthy} from '../utils/assertUtils'
import {CachedSubject} from '../utils/cachedSubject2/CachedSubject2'
import {AuthService} from '../../../auth/auth.service'
import {ApfGeoLocationService} from '../geo-location/apf-geo-location.service'
import {LearnItem, LearnItemId} from '../../../apps/Learn/models/LearnItem'
import {OdmItemHistoryService} from './odm-item-history-service'
import {DictPatch} from '../utils/rxUtils'
import {isNotNullish} from '../utils/utils'

export class OdmServiceOpts {
  dontLoadAllAutomatically = false
  dontStoreWhenModified = false
}

/* TODO rename to OdmItemsService / list service (but also tree) ?
* Responsibilities:
* - holding items in memory
* - converting between db/mem
* - type safety via generics
* - notifying listeners about whole list change
* . - and individual items changes (via OdmItem$)
* - sub-classes inherit to wrap, provide domain/business logic
* */
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
  THistSrv extends OdmItemHistoryService =
    OdmItemHistoryService //<TInMemData, TRawData, TOdmItem$, TMemPatch, TRawPatch>
  >
{

  /* Unused?
  * TODO: more specific name, like throttle to db or ui */
  throttleIntervalMs = 500

  // TODO: throttleLocalUiMs = 200
  throttleSaveToDbMs = 3000 /* NOTE: this does NOT apply to things like start/stop timer which bypass throttle */

  odmBackendFactory = this.injector.get(OdmBackend)

  odmCollectionBackend = this.odmBackendFactory.createCollectionBackend<TRawData>(this.injector, this.className)

  /** rename: item$s$ and consider items$ or itemVals$ for just values for perf.
     And itemsJustList$ for just changes of list, without reporting changes of individual item data-s
     */
  localItems$ = new CachedSubject<TOdmItem$[]>([] /* TODO: make undefined  initially to (force) distinguish loading (and null -> error) from empty list */
    // TODO: onSubscribe : set flag (in CachedSubject.subscribersCount, call setListener )
  ).onSubscribe(() => {
    this.setBackendListener()
  })

  private backendListenerWasSet = false

  get items$() { return this.localItems$ }

  mapIdToItem$ = new Map<TItemId, TOdmItem$>()

  syncStatusService = this.injector.get(SyncStatusService)

  authService = this.injector.get(AuthService)

  geoLocationService = this.injector.get(ApfGeoLocationService)

  itemHistoryService = new OdmItemHistoryService()

  protected constructor(
    protected injector: Injector,
    public className: string,
    public opts : OdmServiceOpts = new OdmServiceOpts(),
  ) {
    this.setBackendListenerIfNecessary()
    // this.subscribeToBackendCollection();
  }

  deleteWithoutConfirmation(item: TOdmItem$) {
    this.deleteWithoutConfirmationById(item.id ! as TItemId)
  }

  deleteWithoutConfirmationById(itemId: TItemId) {
    this.syncStatusService.handleSavingPromise(
      this.odmCollectionBackend.deleteWithoutConfirmation(itemId),
    )
  }

  saveNowToDb(itemToSave: TOdmItem$, modificationOpts?: ModificationOpts) {
    if ( ! (modificationOpts ?. dontSetWhenLastModified ?? false) ) {
      itemToSave.onModified()
    }

    let geo: any = this.geoLocationService.geoLocation$.lastVal ?. currentPosition ?. coords ;
    // debugLog(`geo`, geo)
    if ( geo ) {
      geo = {
        accuracy: geo.accuracy ?? null,
        altitude: geo.altitude ?? null,
        altitudeAccuracy: geo.altitudeAccuracy ?? null,
        heading: geo.heading ?? null,
        lat: geo.latitude ?? null,
        lng: geo.longitude ?? null,
        speed: geo.speed ?? null,
        timestamp: this.geoLocationService.geoLocation$.lastVal ?. currentPosition ?. timestamp
      }
    } else {
      geo = null
    }
    (itemToSave.val as any).whereCreated ??= geo;
    (itemToSave.val as any).whereLastModified = geo
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

  private setBackendListenerIfNecessary() {
    if ( ! this.opts?.dontLoadAllAutomatically /* || true*/) {
      this.setBackendListener()
    }
  }

  private setBackendListener() {
    if ( this.backendListenerWasSet ) {
      return
    }
    const service = this /* MUST use instead of `this`; but could change it to object literal with arrow functions */
    // TODO: this should probably trigger collection listening in backend coll

    // !!!! FIXME: start listener when someone subscribes to items$, e.g. chart QuizHistory

    this.odmCollectionBackend.setListener({
      onAdded(addedItemId: TItemId, addedItemRawData: TRawData) {

        let existingItem: TOdmItem$ = service.getItem$ById(addedItemId)
        // debugLog('setBackendListenerIfNecessary onAdded', service, ...arguments, 'service.itemsCount()', service.itemsCount())

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
        // debugLog('setBackendListenerIfNecessary onModified', ...arguments)
        let convertedItemData = service.convertFromDbFormat(modifiedItemRawData);
        let existingItem = service.getItem$ById(modifiedItemId)
        if (existingItem && existingItem.applyDataFromDbAndEmit) {
          existingItem.applyDataFromDbAndEmit(convertedItemData)
        } else {
          console.error('FIXME existingItem.applyDataFromDbAndEmit(convertedItemData)', existingItem, existingItem && existingItem.applyDataFromDbAndEmit)
        }
        // service.emitLocalItems() -- now handled by onFinishedProcessingChangeSet
      },
      onRemoved(removedItemId: TItemId) {
        service.localItems$.lastVal = service.localItems$ !.lastVal !.filter(item => item.id !== removedItemId)
        // TODO: remove from map? but keep in mind this could be based on query result. Maybe better to have a weak map and do NOT remove manually
        // service.emitLocalItems() -- now handled by onFinishedProcessingChangeSet
      },
      onFinishedProcessingChangeSet() {
        service.emitLocalItems()
      },
    })
    this.backendListenerWasSet = true
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

  deleteAll(toDelete: Set<TItemId>) {
    // TODO: delete audio too
    for ( let idToDelete of toDelete) {
      console.log(`!!! idToDelete`, idToDelete)
      this.deleteWithoutConfirmationById(idToDelete)
    }
  }

  patchThrottledById(id: TItemId, patch: TMemPatch) {
    console.log(`patchThrottledById, `, id, patch)
    // TODO: reverse and implement here to not have to acquire OdmItem$ in case updating massive number of items
    const item$ById = this.getItem$ById(id)
    const subHack: {subscription?: any} = {}
    subHack.subscription = item$ById.val$.subscribe((val) => {
      console.log(`patchThrottledById, item$ById.val$.subscribe`, id, patch, val)
      if ( isNotNullish(val) ) {
        setTimeout /* ensure subscription */(() => {
          subHack.subscription.unsubscribe()
          /* hack to have the Item$ initialized; coz patchThrottled is not using firestore incremental update(), but set() */
          return item$ById.patchThrottled(patch)
        })
      }
    })
  }

  patchThrottledMultipleByIds(itemIds: TItemId[], patch: TMemPatch) {
    // TODO: transaction?
    for ( const id of itemIds) {
      this.patchThrottledById(id, patch)
    }
  }
}
