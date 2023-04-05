import {OryColumn} from '../tree-shared/OryColumn'
import {EventEmitter, Injector} from '@angular/core'
import {throttleTime} from 'rxjs/operators'
import {debugLog} from '../utils/log'
import {OryTreeNode, TreeModel} from './TreeModel'
import {ColumnCell} from '../tree-shared/node-content/Cells'
// import {SyncStatusService} from '../../../libs/AppFedShared/odm/sync-status.service'
import {Columns} from '../tree-shared/node-content/Columns'
import {NodeContentComponent} from '../tree-shared/node-content/node-content.component'
import {NodeInclusion} from './TreeListener'

/** Consider composition over `extends`; or still call it viewSyncer; or CellSyncer as a field on OryTreeNode
 * Name ideas: TreeNodeContentsModel - this would be OdmItem$ and/or cells/columns stuff, but decoupled/separated from tree stuff like nodes, parents, children
 * though one thing in common will be `parent` and `order`, which are kinda "content" too. But treeNode could depend on OdmItem$ to call item$.patch({order: ...})
 * while still it's good to keep this code separate, for clarity.
 * Is there any case in which OdmItem$ might wanna depend on TreeNode (which would be circular)? Prolly not.
 *
 * ==== Should OdmItem$ deal with columns and cells?????????
 *  -> prolly not, coz. think of things like calculated/synthetic/plugin cells/columns, also ones that depend on child/parent nodes.
 *  And an OdmItem$ should be able to exist without being part of a Tree/TreeTable.
 *
 * */
export class TreeTableNode extends OryTreeNode {

  columns: Columns = NodeContentComponent.columnsStatic

  // isApplyingFromDbNow = false   /** TODO: to NodeContentViewSyncer */
  // protected syncStatusService = this.injector.get(SyncStatusService)
  private unsavedChangesPromiseResolveFunc: ( () => void ) | undefined


  /** 500ms almost real-time feeling without overwhelming firestore.
   Perhaps Firestore has "SLA" of around 1second latency anyway (I recall reading something like that,
   where they contrasted the latency with Firebase Realtime DB.
   At 500ms Firefox seems to be lagging behind like even up to 3 seconds after finishing typing.
   2018-11-27 23:14 Increased from 1000 to 4000ms after problem with cursor position reset returned */
  private readonly DELAY_MS_THROTTLE_EDIT_PATCHES_TO_DB = 3000

  private readonly DELAY_MS_BETWEEN_LOCAL_EDIT_AND_APPLYING_FROM_DB = 7000


  whenLastEditedLocallyByColumn = new Map<OryColumn, Date>()

  private mapColumnToEventEmitterOnChange = new Map<OryColumn, EventEmitter<any>>()

  private pendingThrottledItemDataPatch = {}

  get childrenTreeTableNodes() {
    return this.children as TreeTableNode[]
  }

  constructor(
    // public injector: Injector,
    public nodeInclusion: NodeInclusion | undefined | null,
    public itemId: string,
    public treeModel: TreeModel,
    public itemData: any,
  ) {
    super(/*injector, */nodeInclusion, itemId, treeModel, itemData)
    this.subscribeDebouncedOnChangePerColumns()
  }


  private getEventEmitterOnChangePerColumn(column: OryColumn) {
    let eventEmitter = this.mapColumnToEventEmitterOnChange.get(column)
    if ( ! eventEmitter ) {
      eventEmitter = new EventEmitter()
      this.mapColumnToEventEmitterOnChange.set(column, eventEmitter)
    }
    return eventEmitter
  }

  public canApplyDataToViewGivenColumnLocalEdits(column: OryColumn) {
    return this.canApplyDataToViewGivenColumnLastLocalEdit(column)
    /* &&!this.editedHere.get(column)*/
  }

  private canApplyDataToViewGivenColumnLastLocalEdit(column: OryColumn) {
    /* note, this should also take focus into account
     --> evolved to the when-last-edited idea */
    const lastEditedByColumn = this.whenLastEditedLocallyByColumn.get(column)
    if ( ! lastEditedByColumn ) {
      return true
    } else {
      const timeNow = new Date().getTime() /* milliseconds since 1970/01/01 */
      // can only apply incoming changes to view if at least N seconds passed since last local edit
      const msPassedSinceLastEditPerCol = timeNow - lastEditedByColumn.getTime()
      return msPassedSinceLastEditPerCol > this.DELAY_MS_BETWEEN_LOCAL_EDIT_AND_APPLYING_FROM_DB
    }
    /* idea for storing previous locally user-entered vals,
     * to ensure they don't "come back from the grave" if long delay of coming from DB */
  }


  /* TODO move the throttling to Item$
  * Here tackling bug with losing part of title when editing-then-indent.
  * When indenting, it's new UI component.
  *
  * Maybe indenting could force committing the delayed (throttled) change.
  *  */
  private subscribeDebouncedOnChangePerColumns() {
    for ( const column of this.columns.allColumns ) {
      const throttleTimeConfig = {
        leading: false /* probably thanks to this, the first change, of a series, is immediate (observed experimentally) */,
        /* think about false; usually single character; but what if someone pastes something, then it will be fast;
        plus a single character can give good indication that someone started writing */
        trailing: true /* ensures last value is not lost;
          http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-throttleTime */
      }
      const scheduler = undefined
      this.getEventEmitterOnChangePerColumn(column).pipe(
        throttleTime(
          this.DELAY_MS_THROTTLE_EDIT_PATCHES_TO_DB , scheduler, throttleTimeConfig
          // keep in mind that this might have something to do with the update events coming with delay (e.g. reorders)
        )
      ).subscribe((changeEvent) => {
        debugLog('onInputChanged; isApplyingFromDbNow', this.treeModel.isApplyingFromDbNow)
        if (!this.treeModel.isApplyingFromDbNow) {
          // const itemData = this.buildItemDataFromUi()
          const ret = this.patchItemData(this.pendingThrottledItemDataPatch) // patching here
          // this.syncStatusService.handleSavingPromise(ret.onPatchSentToRemote /* title: Saving to remote */)
          this.unsavedChangesPromiseResolveFunc!.call(undefined)
          this.unsavedChangesPromiseResolveFunc = undefined
          this.pendingThrottledItemDataPatch = {}
        } // else: no need to react, since it is being applied from Db
      })
    }
  }

  onInputChangedByUser(cell: ColumnCell, inputNewValue: any) {
    const column = cell.column
    column.setValueOnItemData(this.pendingThrottledItemDataPatch, inputNewValue)
    // TODO this should already mark as unsaved in SyncStatus
    if ( ! this.unsavedChangesPromiseResolveFunc ) {
      const unsavedPromise = new Promise<void>((resolve) => {
        this.unsavedChangesPromiseResolveFunc = resolve
        console.log('this.unsavedChangesPromiseResolveFunc = resolve', resolve)
      })
      // this.syncStatusService.handleUnsavedPromise(unsavedPromise) // using the crude placeholder func to piggy-back on the promise-based approach
    }
    this.getEventEmitterOnChangePerColumn(column).emit(column)
    // this.editedHere.set(column, true)
    this.whenLastEditedLocallyByColumn.set(column, new Date())
  }

}
