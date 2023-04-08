import {DictPatch, PatchableObservable, throttleTimeWithLeadingTrailing} from '../../../libs/AppFedShared/utils/rxUtils'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {Injector} from '@angular/core'
import {TreeTableNode} from './TreeTableNode'
import {DbTreeService} from './db-tree-service'
import {ItemId} from '../db/DbItem'
import {NodeInclusion} from './TreeListener'
import {SyncStatusService} from '../../../libs/AppFedShared/odm/sync-status.service'

type TMemPatch = NodeInclusion

export class TreeNodeInclusion$P<
  TInclusion extends NodeInclusion,
  // TMemPatch extends DictPatch<TInclusion> = DictPatch<TInclusion>
> implements PatchableObservable<TInclusion, TMemPatch> {

  /** Has patch that has not yet had a call to backend DB API (as opposed to not having been synchronized via network) */
  hasPendingPatch = false

  public localUserSavesToThrottle$ : CachedSubject<TInclusion> = new CachedSubject<TInclusion>(/* it's important it's undefined here; otherwise it would send writes to db on load */)

  private unsavedChangesPromiseResolveFunc: ( () => void ) | undefined

  /** dummy not yet used */
  locallyVisibleChanges$: CachedSubject<TInclusion> = new CachedSubject<TInclusion>()

  syncStatusService = this.injector.get(SyncStatusService)

  constructor(
    protected injector: Injector,
    public treeService: DbTreeService,
    public currentVal: TInclusion,
    public itemId: ItemId,
  ) {
    this.localUserSavesToThrottle$.pipe(
      throttleTimeWithLeadingTrailing(2000 /*TreeTableNode.DELAY_MS_THROTTLE_EDIT_PATCHES_TO_DB*/) // this is really debounce now
    ).subscribe(((patch: TMemPatch) => {
      /* why this works only once?
       * Causes saveNowToDb to receive old value
      // this.odmService.saveNowToDb(this as unknown as T)
      this.odmService.saveNowToDb(this.asT)
      */
      // // FIXME: incremental patching
      // this.odmService.saveNowToDb(this)
      // this.resolveFuncPendingThrottledIfNecessary()
      /////
      this.sendPatchToDb(patch)
      this.unsavedChangesPromiseResolveFunc!.call(undefined)
      this.unsavedChangesPromiseResolveFunc = undefined
      // TODO this.pendingThrottledItemDataPatch = {}

      this.hasPendingPatch = false
    }) as any /* TODO investigate after strict */)
  }

  patchThrottled(patch: TMemPatch): void {
    Object.assign(this.currentVal, patch) // patching the value locally, but current impl saves whole object to firestore
    this.hasPendingPatch = true
    // TODO incrementally set patch; and reset it to empty after sendToDb()

    // this.localUserSavesToThrottle$.next(this.asT) // other code listens to this and throttles - saves
    this.localUserSavesToThrottle$.next(this.currentVal) // other code listens to this and throttles - saves
    this.locallyVisibleChanges$.next(this.currentVal) // other code listens to this and throttles - saves
    if ( ! this.unsavedChangesPromiseResolveFunc ) {
      const unsavedPromise = new Promise<void>((resolve) => {
        this.unsavedChangesPromiseResolveFunc = resolve
        console.log('this.unsavedChangesPromiseResolveFunc = resolve', resolve)
      })
      this.syncStatusService.handleUnsavedPromise(unsavedPromise, 'tree node move' /* TODO unify with saving in progress (code, message, handling of unsaved -> saving progression */) // using the crude placeholder func to piggy-back on the promise-based approach
    }
  }


  protected sendPatchToDb(patch: TMemPatch) {
    this.treeService.patchChildInclusionData(
      // this.parent2!.itemId,
      patch.parentItemId,
      patch!.nodeInclusionId,
      patch /* the patch */,
      this.itemId
    )
  }
}
