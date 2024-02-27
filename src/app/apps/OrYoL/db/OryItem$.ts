import {
  DbItemClass,
  DbItemField,
} from './DbItemClass'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {EventEmitter, Injector} from '@angular/core'
import {SyncStatusService} from '../../../libs/AppFedShared/odm/sync-status.service'
import {throttleTime} from 'rxjs/operators'
import {TreeTableNodeContent} from '../tree-model/TreeTableNodeContent'
import {OryItemsService} from '../core/ory-items.service'
import {FirestoreTreeService} from '../db-firestore/firestore-tree.service'
import {HasItemData, HasPatchThrottled, ItemData} from '../tree-model/has-item-data'

export type ItemId = string //& { type: 'ItemId' }

export type NodeInclusionId = string //& { type: 'NodeInclusionId' }

export type DomainItem$ = any

export type DomainItemCtor = new (
  injector: Injector,
  item$: OryItem$,
) => DomainItem$

/** NOTE: this is probably similar to OdmItem$ (or its "can-change-type-at-runtime" variant GenericItem$)
 * thus candidate for merging
 *
 * NOTE: Before/during migrating OrYoL (tree) to OdmItem$ - think of the following scenario.
 * We have a component which has to display something which has data calculated from children, e.g. total time tracked on item and subitems.
 * Would that component accept OdmItem$ or tree node? Coz need to have access to recursive functions on tree children.
 * Maybe the recursive calculations should already be available on OdmItem$ with children.
 *
 * Think how this could be impacted by incremental loading.
 * - Aggregate value could be stored on all parents
 * - component could display a ... / spinner indicating aggregate data from children is still loading.
 *
 * Similar questions if something might depend on _parents_.
 *
 * Should TreeTableContent be shared between multiple nodes (same item in different paths)?
 * - one way to handle this could be to only allow TreeTableContent to access children (which should be the same in all paths), not parents.
 * - - in that sense TreeTableContent could become also to mean children (vertically) as content (not just cells - horizontally)
 *
 * */
export class OryItem$<TData = any> implements HasPatchThrottled<TData> {

  public static readonly DELAY_MS_BETWEEN_LOCAL_EDIT_AND_APPLYING_FROM_DB = 7000


  itemsService = this.injector.get(OryItemsService)

  /** FIXME this is only needed for patchItemData; should be moved */
  treeService = this.injector.get(FirestoreTreeService)

  private mapCtorToDomainItem = new Map<DomainItemCtor, DomainItem$>()

  private whenLastModifiedLocallyByUser?: Date

  constructor(
    public injector: Injector,
    public id: ItemId,
    public itemData?: TData
  ) {
    this.subscribeDebouncedOnChangePerColumns()
  }

  data$ = new CachedSubject<TData>()

  itemClass?: DbItemClass

  hasField(field: DbItemField) {
    return !!this.itemClass?.hasField?.(field)
  }

  // ======== from TreeTableNodeContent:

  // private mapColumnToEventEmitterOnChange = new Map<OryColumn, EventEmitter<any>>()
  protected eventEmitterOnChange = new EventEmitter<any>()

  private pendingThrottledItemDataPatch = {}

  // isApplyingFromDbNow = false   /** TODO: to NodeContentViewSyncer */
  protected syncStatusService = this.injector.get(SyncStatusService)

  private unsavedChangesPromiseResolveFunc: (() => void) | undefined

  /** ignoring column */
  private getEventEmitterOnChangePerColumn(/*column?: OryColumn*/) {
    return this.eventEmitterOnChange // now all columns have same emitter
    // this should be via OdmItem$ anyway

    // let eventEmitter = this.mapColumnToEventEmitterOnChange.get(column)
    // if ( ! eventEmitter ) {
    //   eventEmitter = new EventEmitter()
    //   this.mapColumnToEventEmitterOnChange.set(column, eventEmitter)
    // }
    // return eventEmitter
  }

  /* TODO move the throttling to Item$
* Here tackling bug with losing part of title when editing-then-indent.
* When indenting, it's new UI component.
*
* Maybe indenting could force committing the delayed (throttled) change.
*
* @deprecated
*  */
  private subscribeDebouncedOnChangePerColumns() {
    // for ( const column of this.columns.allColumns ) {
    const throttleTimeConfig = {
      leading: false /* probably thanks to this, the first change, of a series, is immediate (observed experimentally) */,
      /* think about false; usually single character; but what if someone pastes something, then it will be fast;
      plus a single character can give good indication that someone started writing */
      trailing: true /* ensures last value is not lost;
          http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-throttleTime */
    }
    const scheduler = undefined
    this.getEventEmitterOnChangePerColumn().pipe(
      // why is this like that; what if I want to patch more than 1 field/column at once?
      // cumulative patch approach better?
      // e.g. for time-tracking
      throttleTime(
        TreeTableNodeContent.DELAY_MS_THROTTLE_EDIT_PATCHES_TO_DB , scheduler, throttleTimeConfig
        // keep in mind that this might have something to do with the update events coming with delay (e.g. reorders)
      )
    ).subscribe((changeEvent) => {
      // debugLog('onInputChanged; isApplyingFromDbNow', this.treeModel.isApplyingFromDbNow)
      if (!this.itemsService.isApplyingFromDbNow) {
        // const itemData = this.buildItemDataFromUi()
        const ret = this.patchItemDataNonThrottled(this.pendingThrottledItemDataPatch) // patching here
        this.syncStatusService.handleSavingPromise(ret.onPatchSentToRemote, 'saving item to server')
        this.unsavedChangesPromiseResolveFunc!.call(undefined)
        this.unsavedChangesPromiseResolveFunc = undefined
        this.pendingThrottledItemDataPatch = {}
      } // else: no need to react, since it is being applied from Db
    })
    // }
  }

  /**
   * ============== THIS is the main thing to replace
   * - has `any` item-data type
   * - not throttled
   * - will be replaced by OdmItem$::patchThrottled
   *
   * Note this is not throttled and bypasses incoming self-change protection */
  patchItemDataNonThrottled(itemDataPatch: any /* TData */): { onPatchSentToRemote: Promise<void> } {
    // TODO this should use odmitem$
    let ret = this.treeService.patchItemData(this.id, itemDataPatch)
    // TODO: fireOnChangeItemDataOfChildOnParents ?
    return ret
    // this.itemData$.next()
  }



  patchThrottled(patch: any/*FIXME */) {
    this.whenLastModifiedLocallyByUser = new Date()
    Object.assign(this.itemData as any /* FIXME workaround upgrading to Angular 15*/, patch)

    this.pendingThrottledItemDataPatch = {
      ... this.pendingThrottledItemDataPatch,
      ... patch,
    }
    // console.log(`patchThrottled`, patch, `this.unsavedChangesPromiseResolveFunc`, this.unsavedChangesPromiseResolveFunc)
    if ( ! this.unsavedChangesPromiseResolveFunc ) {
      const unsavedPromise = new Promise<void>((resolve) => {
        this.unsavedChangesPromiseResolveFunc = resolve
        // console.log('in promise executor func this.unsavedChangesPromiseResolveFunc = resolve', resolve)
      })
      // console.log('outside of promise this.unsavedChangesPromiseResolveFunc = resolve', this.unsavedChangesPromiseResolveFunc)
      this.syncStatusService.handleUnsavedPromise(unsavedPromise) // using the crude placeholder func to piggy-back on the promise-based approach
    }
    this.data$.next(this.itemData !) // FIXME this should be replaced with OdmItemData

    this.getEventEmitterOnChangePerColumn().emit('something') // FIXME make this cumulative patch, not per-column
    this.itemsService.onItemWithDataPatchedByUserLocally$.next([this, patch]) // NOTE this is throttled
    this.itemsService.onItemAddedOrModified$.next(this) // NOTE this is throttled
  }

  getItemData(): ItemData | undefined {
    return this.data$.lastVal
  }

  getId() {
    return this.id
  }

  onDataArrivedFromRemote(itemData: TData | undefined) {
    this.itemData = itemData
    const lastLocMod = this.whenLastModifiedLocallyByUser?.getTime() ?? 0
    const lastLocModMsAgo = Date.now() - lastLocMod // might wanna use monotonic clock
    // console.log(`lastLocModMsAgo`, lastLocModMsAgo)
    if ( itemData && lastLocModMsAgo > TreeTableNodeContent.DELAY_MS_THROTTLE_EDIT_PATCHES_TO_DB ) {
      this.data$.nextWithCache(itemData)
    }
  }

  /** type MyClassInstance = InstanceType<typeof MyClass>; */
  obtainDomainItem<TCtor extends DomainItemCtor>(ctor: TCtor): InstanceType<TCtor> {
    let ret = this.mapCtorToDomainItem.get(ctor)
    if ( !ret ) {
      ret = new ctor(this.injector, this)
      this.mapCtorToDomainItem.set(ctor, ret)
    }
    return ret
  }
}
