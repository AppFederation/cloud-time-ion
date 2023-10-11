import {OryColumn} from '../tree-shared/OryColumn'
import {EventEmitter, Injector} from '@angular/core'
import {throttleTime} from 'rxjs/operators'
import {debugLog} from '../utils/log'
import {TreeModel} from './TreeModel'
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
import {OryItem$} from '../db/OryItem$'
import {ApfNonRootTreeNode, RootTreeNode} from './TreeNode'

/**
 *
 * TODO: read this for sub-items tree
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
    isArchivedWhen?: Date,
    isArchived: boolean,
  } = any,
  TTreeNode extends RootTreeNode<any> = RootTreeNode<any, any>,
> {

  // protected override createChildNode(nodeInclusion: NodeInclusion): TreeTableNode {
  //   return new TreeTableNode(this.injector, nodeInclusion, 'item_' + uuidv4(), this.treeModel, this.newItemData())
  //   // new TreeTableNode(newInclusion, nodeToAssociate.itemId, this.treeModel, nodeToAssociate.itemData) as TChildNode
  // }

  columns: Columns = NodeContentComponent.columnsStatic


  /** 500ms almost real-time feeling without overwhelming firestore.
   Perhaps Firestore has "SLA" of around 1second latency anyway (I recall reading something like that,
   where they contrasted the latency with Firebase Realtime DB.
   At 500ms Firefox seems to be lagging behind like even up to 3 seconds after finishing typing.
   2018-11-27 23:14 Increased from 1000 to 4000ms after problem with cursor position reset returned */
  public static readonly DELAY_MS_THROTTLE_EDIT_PATCHES_TO_DB = 3000



  whenLastEditedLocallyByColumn = new Map<OryColumn, Date>()

  // get childrenTreeTableNodes() {
  //   return this.children as TreeTableNode[]
  // }

  public treeNode!: TTreeNode

  /** FIXME: not yet fully used because we are still using itemData */
  dbItem!: OryItem$<TItemData>  // new DbItem(this.itemId)

  // TODO item$ here from ODM

  constructor(
    public injector: Injector,
    // nodeInclusion: NodeInclusion | undefined | null,
    public itemId: string,
    // treeModel: TreeModel,
    // itemData: any,
    protected initialItemData: TItemData | undefined,
  ) {
    // super(injector, nodeInclusion, itemId, treeModel, itemData)
  }

  setTreeNodeAndInit(treeNode: TTreeNode) {
    this.treeNode = treeNode
    /** FIXME this should be obtained from ItemsService */
    this.dbItem = this.treeNode.treeModel.obtainItemById(this.getId())
    // this.dbItem.itemData = this.itemData
    this.dbItem.onDataArrivedFromRemote(this.initialItemData) // FIXME this is wrong - does not have to be from remote - could be just node moved (reorder/indent)

    // TODO maybe would set isArchived: false / null here.
    // this.patchThrottled({
    //   isArchived: false,
    // })

    // ;(this.treeNode as any as ApfNonRootTreeNode).nodeInclusion$?.patchThrottled({
    //     isArchived: false,
    // })
    // TODO: also patch inclusion
  }

  getItemData() {
    // console.log('getItemData', this.itemData)
    return this.dbItem.itemData
  }

  get itemData() {
    return this.getItemData()
  }

  /** this protects ANY view that deals with this node; not only the view component that actually made the edit;
   * use-case for this: OrYoL reordering & indent/outdent, where the protected component will be different from the component
   * in which the original edit was done.
   *
   * Extra use-case: editing in details page, and then in sub-items tree.
   * Or switching between pages (coming back to details page to make another edit - might be another component instance)
   *
   * THOUGH, if user didn't edit in a given UI component at all recently, then, do we care about protecting that UI component?
   * The moment we edit smth in new component, the protection should activate.
   * THOUGH: we might still see flashes of older values coming one by one, without even editing.
   * !!!!! And we might start editing just when the older value arrived, thus losing the latest content.
   * !!!!! ------->>>>> THUS THE PROTECTION SHOULD PROLLY BE AT THE WHOLE OdmItem$, for safe editing (might get old values on some fields, new values on other)
   * Though this would prevent updating visible value in other places in the app / page ---> NO coz the protection is JUST for changes incoming FROM **DB**.
   * So this canApplyDataToViewGivenColumnLocalEdits() is bullshit coz it does not know if change is incoming from DB or not??
   * At some point there could be a changes listener that would get source-of-change info (db/local-edit) ?
   *
   * Maybe it should depend on focus, instead of edited state? Coz having focus is when the risk of starting writing on old value occurs.
   * Though blocking updaters on focused UI component, would cause changes from another machine to not come.
   * But we can distinguish if edit happened locally by user recently or not.
   *
   *
   * NOTE: this is now being shifted to OdmCell for Learn Sub-items (but components will still use the same OdmCell instance)
   * TODO: re-read this to decide if this should be be at OdmCell level or OdmItem$ per-field "`select`-s" PatchableObservable-s
   * */
  public canApplyDataToViewGivenColumnLocalEdits(column: OryColumn) {
    const ret = this.canApplyDataToViewGivenColumnLastLocalEdit(column)
    debugLog(`canApplyDataToViewGivenColumnLocalEdits`, ret, column)
    // return true;
    return ret
    /* &&!this.editedHere.get(column)*/
  }

  /** FIXME move this into item$ */
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
      return msPassedSinceLastEditPerCol > OryItem$.DELAY_MS_BETWEEN_LOCAL_EDIT_AND_APPLYING_FROM_DB
    }
    /* idea for storing previous locally user-entered vals,
     * to ensure they don't "come back from the grave" if long delay of coming from DB */
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
    const patch = {}
    column.setValueOnItemData(patch, inputNewValue)
    this.patchThrottled(patch)
    // this.getEventEmitterOnChangePerColumn().emit(column) // FIXME make this cumulative patch, not per-column
    // this.editedHere.set(column, true)
    this.whenLastEditedLocallyByColumn.set(column, new Date())

    column.setValueOnItemData(this.itemData, inputNewValue) // NOTE this was moved from NodeContentComponent::onInputChanged
  }

  patchThrottled(patch: any) {
    this.dbItem.patchThrottled(patch)
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


  getId() {
    return this.itemId
  }

}
