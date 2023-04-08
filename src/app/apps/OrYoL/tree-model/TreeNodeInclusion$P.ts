import {DictPatch, PatchableObservable, throttleTimeWithLeadingTrailing} from '../../../libs/AppFedShared/utils/rxUtils'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {Injector} from '@angular/core'
import {TreeTableNode} from './TreeTableNode'
import {DbTreeService} from './db-tree-service'
import {ItemId} from '../db/DbItem'
import {NodeInclusion} from './TreeListener'

type TMemPatch = NodeInclusion

export class TreeNodeInclusion$P<
  TInclusion extends NodeInclusion,
  // TMemPatch extends DictPatch<TInclusion> = DictPatch<TInclusion>
> implements PatchableObservable<TInclusion, TMemPatch> {

  /** Has patch that has not yet had a call to backend DB API (as opposed to not having been synchronized via network) */
  hasPendingPatch = false

  public localUserSavesToThrottle$ : CachedSubject<TInclusion>

  constructor(
    protected injector: Injector,
    public treeService: DbTreeService,
    public currentVal: TInclusion,
    public itemId: ItemId,
  ) {
    this.localUserSavesToThrottle$ = new CachedSubject<TInclusion>(currentVal)
    this.localUserSavesToThrottle$.pipe(
      throttleTimeWithLeadingTrailing(1500 /*TreeTableNode.DELAY_MS_THROTTLE_EDIT_PATCHES_TO_DB*/) // this is really debounce now
    ).subscribe(((patch: TMemPatch) => {
      /* why this works only once?
       * Causes saveNowToDb to receive old value
      // this.odmService.saveNowToDb(this as unknown as T)
      this.odmService.saveNowToDb(this.asT)
      */
      // // FIXME: incremental patching
      // this.odmService.saveNowToDb(this)
      // this.hasPendingPatch = false
      // this.resolveFuncPendingThrottledIfNecessary()
      /////
      this.sendPatchToDb(patch)
    }) as any /* TODO investigate after strict */)
  }

  /** dummy not yet used */
  locallyVisibleChanges$: CachedSubject<TInclusion> = new CachedSubject<TInclusion>()

  patchThrottled(patch: TMemPatch): void {
    Object.assign(this.currentVal, patch) // patching the value locally, but current impl saves whole object to firestore
    this.hasPendingPatch = true

    // this.localUserSavesToThrottle$.next(this.asT) // other code listens to this and throttles - saves
    this.localUserSavesToThrottle$.next(this.currentVal) // other code listens to this and throttles - saves
    this.locallyVisibleChanges$.next(this.currentVal) // other code listens to this and throttles - saves

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
