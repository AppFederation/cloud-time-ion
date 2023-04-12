import {OryColumn} from '../tree-shared/OryColumn'
import {EventEmitter, Injector} from '@angular/core'
import {throttleTime} from 'rxjs/operators'
import {debugLog} from '../utils/log'
import {RootTreeNode, TreeModel} from './TreeModel'
import {ColumnCell} from '../tree-shared/node-content/Cells'
import {SyncStatusService} from '../../../libs/AppFedShared/odm/sync-status.service'
import {Columns} from '../tree-shared/node-content/Columns'
import {NodeContentComponent} from '../tree-shared/node-content/node-content.component'
import {NodeInclusion} from './TreeListener'
import {uuidv4} from '../../../libs/AppFedShared/utils/utils-from-oryol'
import {sumBy} from 'lodash-es'
import {minutesToString, parseTimeToMinutes} from '../utils/time-utils'
import {isEmpty} from '../../../libs/AppFedShared/utils/utils-from-oryol'
import {HasItemData} from './has-item-data'
import {DbItem} from '../db/DbItem'

/**
 *
 * Node content: in the horizontal sense (not sub-nodes). Possibly name: NodeOwnContent, NodeItemContent;
 *
 * Consider composition over `extends`; or still call it viewSyncer; or CellSyncer as a field on OryTreeNode
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
export class TreeTableNodeContent <
  TItemData extends { /* FIXME prolly only TNodeContent should care about TData ( TItemData ) - orthogonal concern */
    title: string,
    isDone?: boolean,
  } = any,
  TTreeNode extends RootTreeNode<any> = RootTreeNode<any, any>,
> implements HasItemData {

  // protected override createChildNode(nodeInclusion: NodeInclusion): TreeTableNode {
  //   return new TreeTableNode(this.injector, nodeInclusion, 'item_' + uuidv4(), this.treeModel, this.newItemData())
  //   // new TreeTableNode(newInclusion, nodeToAssociate.itemId, this.treeModel, nodeToAssociate.itemData) as TChildNode
  // }

  columns: Columns = NodeContentComponent.columnsStatic

  // isApplyingFromDbNow = false   /** TODO: to NodeContentViewSyncer */
  protected syncStatusService = this.injector.get(SyncStatusService)

  private unsavedChangesPromiseResolveFunc: (() => void) | undefined


  /** 500ms almost real-time feeling without overwhelming firestore.
   Perhaps Firestore has "SLA" of around 1second latency anyway (I recall reading something like that,
   where they contrasted the latency with Firebase Realtime DB.
   At 500ms Firefox seems to be lagging behind like even up to 3 seconds after finishing typing.
   2018-11-27 23:14 Increased from 1000 to 4000ms after problem with cursor position reset returned */
  public static readonly DELAY_MS_THROTTLE_EDIT_PATCHES_TO_DB = 3000

  private readonly DELAY_MS_BETWEEN_LOCAL_EDIT_AND_APPLYING_FROM_DB = 7000


  whenLastEditedLocallyByColumn = new Map<OryColumn, Date>()

  // private mapColumnToEventEmitterOnChange = new Map<OryColumn, EventEmitter<any>>()
  protected eventEmitterOnChange = new EventEmitter<any>()

  private pendingThrottledItemDataPatch = {}

  // get childrenTreeTableNodes() {
  //   return this.children as TreeTableNode[]
  // }

  public treeNode!: TTreeNode

  /** FIXME: not yet fully used because we are still using itemData */
  dbItem!: DbItem<TItemData>  // new DbItem(this.itemId)

  // TODO item$ here from ODM

  constructor(
    public injector: Injector,
    // nodeInclusion: NodeInclusion | undefined | null,
    itemId: string,
    // treeModel: TreeModel,
    // itemData: any,
    public itemData: TItemData | null,
  ) {
    // super(injector, nodeInclusion, itemId, treeModel, itemData)
    this.subscribeDebouncedOnChangePerColumns()
  }

  setTreeNodeAndInit(treeNode: TTreeNode) {
    this.treeNode = treeNode
    this.dbItem = this.treeNode.treeModel.obtainItemById(this.getId())
  }

  getItemData() {
    // console.log('getItemData', this.itemData)
    return this.itemData
  }

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

  /** this protects ANY view that deals with this node; not only the view component that actually made the edit;
   * use-case for this: reordering & indent/outdent, where the protected component will be different from the component
   * in which the original edit was done.
   * */
  public canApplyDataToViewGivenColumnLocalEdits(column: OryColumn) {
    const ret = this.canApplyDataToViewGivenColumnLastLocalEdit(column)
    debugLog(`canApplyDataToViewGivenColumnLocalEdits`, ret, column)
    // return true;
    return ret
    /* &&!this.editedHere.get(column)*/
  }

  private canApplyDataToViewGivenColumnLastLocalEdit(column: OryColumn) {
    /* note, this should also take focus into account
     --> evolved to the when-last-edited idea */
    const lastEditedByColumn = this.whenLastEditedLocallyByColumn.get(column)
    if ( ! lastEditedByColumn ) {
      return true
    } else {
      const timeNow = new Date().getTime() /* milliseconds since 1970/01/01 */ /* TODO should this use monotonic clock? https://caniuse.com/?search=performance.now */
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
        if (!this.treeNode.treeModel.isApplyingFromDbNow) {
          // const itemData = this.buildItemDataFromUi()
          const ret = this.patchItemData(this.pendingThrottledItemDataPatch) // patching here
          this.syncStatusService.handleSavingPromise(ret.onPatchSentToRemote, 'saving item to server')
          this.unsavedChangesPromiseResolveFunc!.call(undefined)
          // FIXME:
          // only first edit; and error occurs 4 TIMES
          // FIXME: ERROR TypeError: Cannot read properties of undefined (reading 'call')
          //     at SafeSubscriber._next (TreeTableNode.ts:148:50)
          //     at SafeSubscriber.__tryOrUnsub (Subscriber.js:183:16)
          //     at SafeSubscriber.next (Subscriber.js:122:22)
          //     at Subscriber._next (Subscriber.js:72:26)
          //     at Subscriber.next (Subscriber.js:49:18)
          //     at ThrottleTimeSubscriber.clearThrottle (throttleTime.js:59:34)
          //     at AsyncAction.dispatchNext (throttleTime.js:71:16)
          //     at AsyncAction._execute (AsyncAction.js:51:18)
          //     at AsyncAction.execute (AsyncAction.js:39:28)
          //     at AsyncScheduler.flush (AsyncScheduler.js:33:32)
          this.unsavedChangesPromiseResolveFunc = undefined
          this.pendingThrottledItemDataPatch = {}
        } // else: no need to react, since it is being applied from Db
      })
    // }
  }

  toggleDone() {
    this.patchThrottled({
      isDone: this.itemData?.isDone ? null : new Date() /* TODO: `this.setDoneNow(! this.isDone)` */ ,
    })
    // FIXME: fireOnChangeItemDataOfChildOnParents and on this

    // TODO: focus node below, but too tied to UI; has to know about column too
  }

  /** related to patchThrottled() */
  onInputChangedByUser(cell: ColumnCell, inputNewValue: any) {
    const column = cell.column
    column.setValueOnItemData(this.pendingThrottledItemDataPatch, inputNewValue)
    this.patchThrottled(this.pendingThrottledItemDataPatch)
    this.getEventEmitterOnChangePerColumn().emit(column) // FIXME make this cumulative patch, not per-column
    // this.editedHere.set(column, true)
    this.whenLastEditedLocallyByColumn.set(column, new Date())

    column.setValueOnItemData(this.itemData, inputNewValue) // NOTE this was moved from NodeContentComponent::onInputChanged
  }

  patchThrottled(patch: any) {
    this.pendingThrottledItemDataPatch = {
      ... this.pendingThrottledItemDataPatch,
      ... patch,
    }
    console.log(`patchThrottled`, patch, `this.unsavedChangesPromiseResolveFunc`, this.unsavedChangesPromiseResolveFunc)
    if ( ! this.unsavedChangesPromiseResolveFunc ) {
      const unsavedPromise = new Promise<void>((resolve) => {
        this.unsavedChangesPromiseResolveFunc = resolve
        // console.log('in promise executor func this.unsavedChangesPromiseResolveFunc = resolve', resolve)
      })
      console.log('outside of promise this.unsavedChangesPromiseResolveFunc = resolve', this.unsavedChangesPromiseResolveFunc)
      this.syncStatusService.handleUnsavedPromise(unsavedPromise) // using the crude placeholder func to piggy-back on the promise-based approach
    }
    this.getEventEmitterOnChangePerColumn().emit('something') // FIXME make this cumulative patch, not per-column
  }

  /***   moved from OryTreeNode: */

  hasField(attribute: OryColumn) {
    // return this.dbItem.hasField
    return true // HACK FIXME
  }

  hasMissingVal(column: OryColumn) {
    const valueFromItemData = column.getValueFromItemData(this.itemData)
    const hasField = this.hasField(column)
    if ( ! hasField ) {
      return false
    }
    /* TODO: could also use effective val (allowing calculated too) instead of plain user-entered
      however: this could cause O(n^2). Shortcut could be just to check if it has children.
     */
    return isEmpty(valueFromItemData)
  }

  public getValueForColumn(column: OryColumn) {
    return column.getValueFromItemData(this.itemData)
  }

  /**
   * ============== THIS is the main thing to replace
   * - has `any` item-data type
   * - not throttled
   * - will be replaced by OdmItem$::patchThrottled
   *
   * Note this is not throttled and bypasses incoming self-change protection */
  patchItemData(itemDataPatch: any /* TData */): { onPatchSentToRemote: Promise<void> } {
    // TODO this should use odmitem$
    Object.assign(this.itemData, itemDataPatch)
    let ret = this.treeNode.treeModel.treeService.patchItemData(this.treeNode.itemId, itemDataPatch)
    // TODO: fireOnChangeItemDataOfChildOnParents ?
    this.treeNode.treeModel.dataItemsService.onItemWithDataPatchedByUserLocally$.next([this, itemDataPatch])
    this.dbItem.data$.next(this.itemData !) // FIXME this should be replaced with OdmItemData
    return ret
    // this.itemData$.next()
  }

  getId() {
    return this.treeNode.itemId
  }

}
