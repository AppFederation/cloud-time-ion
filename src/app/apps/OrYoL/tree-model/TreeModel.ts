import { TreeNode } from 'primeng/primeng'
import {
  NodeAddEvent,
  NodeInclusion,
} from './TreeListener'
import {
  debugLog,
  FIXME,
  traceLog,
} from '../utils/log'
import { DbTreeService } from './db-tree-service'
import {
  EventEmitter,
  Injectable,
  Injector,
} from '@angular/core'
import { isNullOrUndefined } from 'util'
import {
  isEmpty,
  nullOrUndef,
} from '../utils/utils'
import { sumBy } from 'lodash';
import { OryColumn } from '../tree-shared/OryColumn'
import { ReplaySubject } from 'rxjs/ReplaySubject'
import { MultiMap } from '../utils/multi-map'
import {
  NodeOrderer,
  NodeOrderInfo,
} from './node-orderer'
import { AuthService } from '../core/auth.service'
import { PermissionsManager } from './PermissionsManager'
import {
  DbItem,
  ItemId,
  NodeInclusionId,
} from '../db/DbItem'
import {
  sumRecursivelyIncludingRoot,
  sumRecursivelyJustChildren,
} from '../utils/collection-utils'
import { HasItemData } from './has-item-data'
import { DataItemsService } from '../core/data-items.service'
import {
  minutesToString,
  parseTimeToMinutes,
} from '../utils/time-utils'


/**
 * Created by kd on 2017-10-27.
 *
 * NOTE: this file has both TreeModel and TreeNode to avoid a warning about circular dependency between files.
 * Maybe I will find a better way, perhaps involving refactor...
 */

const uuidV4 = require('uuid/v4');


/** ======================================================================================= */
/** TODO: this should be delegated to database as it might have its own conventions/implementation (e.g. firebase push id) */
let generateNewInclusionId = function () {
  return 'inclusion_' + uuidV4()
}


/** ======================================================================================= */
/** ======================================================================================= */
export class OryTreeNode<TData = any> implements TreeNode, HasItemData {

  // ==== from PrimeNG's TreeNode:

  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  children: OryTreeNode[] = [];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: TreeNode;
  /** because `parent` is reset to null by the tree component if the node is top-level.
   * Possibly rename to parentEvenIfRoot or parentEvenIfTopLevel */
  parent2?: OryTreeNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;

  // ==== End of PrimeNG's TreeNode

  get title() {
    return this.itemData && this.itemData.title
  }

  /** TODO: rename to itemData$ and use CachedSubject to get initial val too;
   * TODO: unify with DbItem.data$ */
  onChangeItemData = new EventEmitter()
  onChangeItemDataOfChild = new EventEmitter()

  startTime = new Date()

  /** FIXME: not yet fully used because we are still using itemData */
  dbItem = this.treeModel.obtainItemById(this.itemId) // new DbItem(this.itemId)


  /** 2020-02-02 Decided that done/cancelled should be a core concept to tree node,
   * as it will simplify a lot of methods, at minimal cost in this file. Also, where else to put it... */
  public get isDoneOrCancelled() { return this.itemData.isDone /* TODO: cancelled */ }

  public get hasChildren() {
    return this.numChildren > 0
  }

  public get numChildren() {
    return this.children && this.children.length || 0
  }


  static INITIAL_TITLE = ''

  expansion = new class Expansion {
    constructor(public treeNode: OryTreeNode) {}

    setExpansionOnParentsRecursively(expandToSet: boolean) {
      this.treeNode.getAncestorsPathArray().forEach(node => {
        node.expanded = expandToSet
      })
    }

    areParentsExpandedToMakeThisNodeVisible(): boolean {
      if ( this.treeNode.isRoot ) {
        return this.treeNode.treeModel.isRootShown
      }
      // return false
      return this.treeNode.getAncestorsPathArrayExcludingVirtualRoot().every(node => {
        return node.expanded
      })
    }

    setExpanded(expansionState: boolean, recursive: boolean | {recursive: boolean}) {
      const recursiveAsOptions = (recursive as {recursive: boolean})
      if ( recursiveAsOptions && ! isNullOrUndefined(recursiveAsOptions.recursive) ) {
        recursive = recursiveAsOptions.recursive
      }

      this.treeNode.expanded = expansionState
      if ( recursive ) {
        this.treeNode.children.forEach( (node: OryTreeNode) => {
          node.expansion.setExpanded(expansionState, recursive);
        });
      }
    }

    toggleExpansion(recursive: boolean) {
      this.setExpanded(! this.treeNode.expanded, recursive)
    }

  }(this)

  _removeChild(nodeToRemove: OryTreeNode) {
    this.children = this.children.filter(node => node !== nodeToRemove)
  }

  get isRoot() {
    return this.treeModel.root === this;
  }

  get isVisualRoot() {
    return this === this.treeModel.navigation.visualRoot
  }

  get lastChildNode(): OryTreeNode {
    return this.getChildAtIndexOrNull(this.children && this.children.length - 1)
  }

  get isDayPlan() {
    return this.parent2 && this.parent2.itemId === 'item_35023937-195c-4b9c-b265-5e8a01cf397e'
  }

  /** conceptual differences between note and journal entry: note is more pertaining to the topic,
   * whereas journal entry is more about the User's state in a given moment, useful for retrospective, tracking mood, etc. */
  get isJournalEntry() {
    return this.parent2 && this.parent2.itemId === 'item_50872811-928d-4878-94c0-0df36667be0e'
  }

  get isMilestone() {
    const milestonesNodeId = 'item_28cca5d5-6935-4fb1-907a-44f1f1898851'
    // return //this.parent2 && this.parent2.itemId === milestonesNodeId ||
    return (this.parent2 && this.parent2.parent2 && this.parent2.parent2.itemId === milestonesNodeId )
  }

  get isTask() {
    return this.parent2 && (this.parent2.isMilestone || this.parent2.isDayPlan)
  }

  get isChildOfRoot() {
    return ! (this.parent2 && this.parent2.parent2) // top-level node (our parent is the virtual root)
  }

  constructor(
    public nodeInclusion: NodeInclusion,
    public itemId: string,
    public treeModel: TreeModel,
    public itemData: any
  ) {}

  addSiblingAfterThis(newNode?: OryTreeNode) {
    return this.parent2.addChild(this, newNode)
  }

  public getIndexInParent() {
    return (
      this.parent2 &&
      this.parent2.children &&
      this.parent2.children.indexOf(this)
    )
  }

  getSiblingNodeAboveThis() {
    const index = this.getIndexInParent()
    return this.parent2.getChildAtIndexOrNull(index - 1)
  }

  getSiblingNodeBelowThis() {
    const index = this.getIndexInParent()
    // console.log('getNodeBelow index', index, 'count', this.parent2.children.length)
    const childAtIndexOrNull = (
      this.parent2 &&
      this.parent2.getChildAtIndexOrNull(index + 1)
    )
    debugLog('getNodeBelow childAtIndexOrNull', childAtIndexOrNull)
    return childAtIndexOrNull
  }

  getNodeVisuallyAboveThis(): OryTreeNode {
    if ( this.isRoot ) {
      return this.treeModel.root.getLastMostNestedVisibleNodeRecursively()
    }
    let ret: OryTreeNode
    const siblingNodeAboveThis = this.getSiblingNodeAboveThis()
    if ( siblingNodeAboveThis ) {
      const lastMostNestedNodeRecursively = siblingNodeAboveThis.getLastMostNestedVisibleNodeRecursively()
      ret =  lastMostNestedNodeRecursively
    } else {
      ret = siblingNodeAboveThis ||
        this.parent2 || /* note this IS parent2 - should go to the root of all (if it is shown...) */
        this.treeModel.root.getLastMostNestedVisibleNodeRecursively() // not found -- wrap around to bottom-most
    }
    if ( ret.expansion.areParentsExpandedToMakeThisNodeVisible()
        /* TODO: might need smth like && isVisible to handle the isRootVisible case. Later also think about filtering */
    ) {
      debugLog('getNodeVisuallyAboveThis 1')
      return ret
    } else {
      debugLog('getNodeVisuallyAboveThis 2')
      // recursive call:
      return ret.getNodeVisuallyAboveThis() // skip this one, as it is not visible via being collapsed
    }
  }

  getNodeVisuallyBelowThis(): OryTreeNode {
    // this could be extracted as a generic tree util func, a'la sumRecursively
    let ret: OryTreeNode
    const simple = (
      this.children
      && this.children.length
      && this.children[0]
      || this.getSiblingNodeBelowThis()
      // ||
    )
    if ( simple ) {
      ret = simple
    } else {
      let parent = this.parent2
      while (parent) {
        if ( parent.getSiblingNodeBelowThis() ) {
          ret =  parent.getSiblingNodeBelowThis()
          break
        }
        parent = parent.parent2
      }
    }
    // not found - wrap around to top-most
    ret = ret || this.treeModel.root.children[0]
    if ( ! ret.expansion.areParentsExpandedToMakeThisNodeVisible() ) {
      return ret.getNodeVisuallyBelowThis() // recursive call
    } else {
      return ret
    }
  }

  getLastMostNestedVisibleNodeRecursively() {
    const lastDirectChild = this.getLastDirectChild()
    if ( lastDirectChild && ! lastDirectChild.expansion.areParentsExpandedToMakeThisNodeVisible() ) {
      return this // we stop at this because deeper one is not visible
    }
    if ( lastDirectChild ) {
      return lastDirectChild.getLastMostNestedVisibleNodeRecursively()
    } else {
      return this
    }
  }

  public getLastDirectChild() {
    return this.children && this.children.length > 0 && this.children[this.children.length - 1]
  }

  _appendChildAndSetThisAsParent(nodeToAppend?: OryTreeNode, insertBeforeIndex?: number) {
    // TODO: consider reacting to multi-node changes here for all nodes with the same
    if ( ! nodeToAppend ) {
      nodeToAppend = new OryTreeNode(null, '' + uuidV4(), this.treeModel, this.newItemData())
    }
    const afterNode = this.lastChildNode

    if ( nullOrUndef(insertBeforeIndex) ) {
      insertBeforeIndex = this.children.length
    }
    if ( nullOrUndef(this.children) ) {
      this.children = []
    }
    nodeToAppend.parent = this
    nodeToAppend.parent2 = this

    // add node to other nodes of the same itemId:
    for ( const node of this.treeModel.getNodesByItemId(this.itemId)) {
      this.children.splice(insertBeforeIndex, 0, nodeToAppend)
      this.treeModel.registerNode(nodeToAppend)
    }
    return nodeToAppend
  }

  private newItemData() {
    return {title: OryTreeNode.INITIAL_TITLE}
  }

  getChildAtIndexOrNull(index: number): OryTreeNode | null {
    if ( this.isIndexPresent(index) ) {
      return this.children[index]
    } else {
      return null
    }
  }

  /** TODO: rename isItemIndexPresent */
  private isIndexPresent(index: number): boolean {
    const lastIndex = this.children.length - 1
    return ! (index < 0 || index > lastIndex);
  }

  /* TODO: should be called *create*, because it is a completely new node/item involving db, vs addChild just looks like tree-only operation */
  addChild(afterExistingNode?: OryTreeNode, newNode?: OryTreeNode) {
    if ( ! afterExistingNode && this.children.length > 0 ) {
      afterExistingNode = this.lastChildNode
    }

    // console.log('addChild, afterExistingNode', afterExistingNode)
    newNode = newNode || new OryTreeNode(null, 'item_' + uuidV4(), this.treeModel, this.newItemData())

    const nodeBelow = afterExistingNode && afterExistingNode.getSiblingNodeBelowThis()
    // console.log('addChild: nodeBelow', nodeBelow)
    const nodeInclusion: NodeInclusion = newNode.nodeInclusion || new NodeInclusion(generateNewInclusionId())

    this.treeModel.nodeOrderer.addOrderMetadataToInclusion(
      {
        inclusionBefore: afterExistingNode && afterExistingNode.nodeInclusion,
        inclusionAfter: nodeBelow && nodeBelow.nodeInclusion,
      },
      nodeInclusion,
    )
    newNode.nodeInclusion = nodeInclusion

    this.treeModel.permissionsManager.onAfterCreated(newNode)

    this.treeModel.treeService.addChildNode(this, newNode)

    const newNodeIndex = afterExistingNode ? afterExistingNode.getIndexInParent() + 1 : 0
    this._appendChildAndSetThisAsParent(newNode, newNodeIndex) // this is to avoid delay caused by Firestore; for UX
    // TODO: handle adding child in multiple parents; and this addChild method should actually accept DbItem instead of node, coz it really might create multiple nodes
    return newNode
  }

  addAssociationsHere(nodes: OryTreeNode[], beforeNode: OryTreeNode | undefined) {
    // TODO: use beforeNode
    FIXME('addAssociationsHere not impl')
    for ( const nodeToAssociate of nodes ) {
      const newInclusion = new NodeInclusion(/* FIXME handle order */generateNewInclusionId())
      this.treeModel.nodeOrderer.addOrderMetadataToInclusion(
        {
          inclusionBefore: this.lastChildNode && this.lastChildNode.nodeInclusion,
          inclusionAfter: null,
        },
        newInclusion,
      )

      const newNode = new OryTreeNode(newInclusion, nodeToAssociate.itemId, this.treeModel, nodeToAssociate.itemData)
      this.treeModel.treeService.addAssociateSiblingAfterNode(this, newNode, this.lastChildNode)
    }
  }

  /* This could/should probably be unified with reorder code */
  moveInclusionsHere(nodes: OryTreeNode[], beforeNode: { beforeNode: OryTreeNode }) {
    // FIXME('moveInclusionsHere: need to calculate order numbers to be last children')
    for ( const childNodeToAssociate of nodes ) {
      const nodeAfter = beforeNode && beforeNode.beforeNode
      let nodeBefore = nodeAfter && nodeAfter.getSiblingNodeAboveThis()
      if ( ! nodeAfter && ! nodeBefore ) {
        // both nodeAfter and nodeBefore can become falsy, causing order == 0
        nodeBefore = this.lastChildNode
      }
      const inclusionToModify = childNodeToAssociate.nodeInclusion
      this.treeModel.nodeOrderer.addOrderMetadataToInclusion(
        {
          inclusionBefore: nodeBefore && nodeBefore.nodeInclusion,
          inclusionAfter: nodeAfter && nodeAfter.nodeInclusion,
        },
        inclusionToModify
      )
      this.patchChildInclusionData(inclusionToModify, childNodeToAssociate)
      childNodeToAssociate.parent2._removeChild(childNodeToAssociate)
      const insertionIndex = nodeAfter ? nodeAfter.getIndexInParent() : this.children.length
      this._appendChildAndSetThisAsParent(childNodeToAssociate, insertionIndex)
    }
  }

  private patchChildInclusionData(inclusionToModify, childNodeToAssociate) {
    this.treeModel.treeService.patchChildInclusionData(
      /*nodeToAssociate.itemId*/ this.itemId /* parent*/,
      inclusionToModify.nodeInclusionId,
      inclusionToModify,
      childNodeToAssociate.itemId,
    )
  }

  deleteWithoutConfirmation() {
    this.treeModel.treeService.deleteWithoutConfirmation(this.itemId)
    this.parent2._removeChild(this)
  }

  patchItemData(itemDataPatch: any /* TData */) {
    Object.assign(this.itemData, itemDataPatch)
    this.treeModel.treeService.patchItemData(this.itemId, itemDataPatch)
    // TODO: fireOnChangeItemDataOfChildOnParents ?
    this.treeModel.dataItemsService.onItemWithDataPatchedByUserLocally$.next([this, itemDataPatch])
    this.dbItem.data$.next(this.itemData)
    // this.itemData$.next()
  }

  reorderUp() {
    // TODO: if topmost, reorder to last item in this plan or to previous plan
    const siblingNodeAboveThis = this.getSiblingNodeAboveThis()
    const order = siblingNodeAboveThis ? {
      inclusionBefore:
        siblingNodeAboveThis &&
        siblingNodeAboveThis.getSiblingNodeAboveThis() &&
        siblingNodeAboveThis.getSiblingNodeAboveThis().nodeInclusion,
      inclusionAfter:
        siblingNodeAboveThis &&
        siblingNodeAboveThis.nodeInclusion
    } : { // wrap-around to last
      inclusionBefore: this.parent2.lastChildNode.nodeInclusion,
      inclusionAfter: null
    }
    this.reorder(order)
  }

  reorderDown() {
    const siblingNodeBelowThis = this.getSiblingNodeBelowThis()
    const order = siblingNodeBelowThis ? {
      inclusionBefore:
        siblingNodeBelowThis &&
        siblingNodeBelowThis.nodeInclusion,
      inclusionAfter:
        siblingNodeBelowThis &&
        siblingNodeBelowThis.getSiblingNodeBelowThis() &&
        siblingNodeBelowThis.getSiblingNodeBelowThis().nodeInclusion
    } : { // wrap-around to first
      inclusionBefore: null,
      inclusionAfter: this.parent2.children[0].nodeInclusion
    }
    this.reorder(order)
  }

  reorder(order: NodeOrderInfo) {
    debugLog('reorder order, this.parent2', order, this.parent2)
    // TODO: replace patch with set due to problems with "no document to update" after quickly reordering/indenting after creating
    const inclusion = this.nodeInclusion
    this.treeModel.nodeOrderer.addOrderMetadataToInclusion(order, inclusion)

    { // reorder locally to avoid UI lag, e.g. when quickly reordering up/down and perhaps will remove keyboard appearing/disappearing on android
      this.parent2._removeChild(this)
      const insertionIndex = this.parent2.findInsertionIndexForNewInclusion(inclusion)
      this.parent2._appendChildAndSetThisAsParent(this, insertionIndex)
      this.treeModel.treeListener.onAfterNodeMoved() // fixes focus being lost after reorder
      // TODO: duplicate with onNodeInclusionModified - extract applyParentAndOrder or smth
    }

    // this.patchChildInclusionData()
    this.treeModel.treeService.patchChildInclusionData(
      this.parent2.itemId,
      this.nodeInclusion.nodeInclusionId,
      inclusion,
      this.itemId
    )
  }

  // ======================================================
  // TODO: extract classes like TaskNodeContent, DayPlanNodeContent
  // since nodes are to allow changing their type, we would just swap an instance of the class mentioned above
  // the separation first would be mainly to separate generic node-logic from time-planning specific, etc.


  /** TODO: move to NumericCell */
  timeLeftSumText(column: OryColumn) {
    const minutesTotalLeft = this.valueLeftSum(column)
    return minutesToString(minutesTotalLeft)
  }

  /** TODO: move to NumericCell */
  valueLeftSum(column: OryColumn) {
    const columnVal = column.getValueFromItemData(this.itemData)
    const selfTimeLeft = ( columnVal && parseTimeToMinutes(columnVal)) || 0
    // TODO: use AggregateValue class
    const childrenTimeLeftSum = this.getChildrenTimeLeftSum(column)
    return Math.max(selfTimeLeft, childrenTimeLeftSum)
  }

  getChildrenTimeLeftSum(column: OryColumn) {
    return sumBy(this.children, childNode => {
      return childNode.effectiveValueLeft(column)
    })
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

  /** TODO: move to NumericCell */
  missingValsCount(column: OryColumn) {
    return this.getChildrenMissingValsCount(column) + this.hasMissingVal(column) ? 1 : 0
    // const missingValsCount = count(this.children, )
    // return missingValsCount
  }

  getChildrenMissingValsCount(column: OryColumn) {
    const hasMissingValFunc = (node: OryTreeNode) => {
      return ! node.isDoneOrCancelled && node.hasMissingVal(column) // TODO: ignore done ones
    }

    const missingValsCountFunc = (node: OryTreeNode) => {
      if ( node.hasChildren ) {
        return 0 // will be taken care in children
      }
      return hasMissingValFunc(node) ? 1 : 0
    }
    return this.getSumRecursivelyJustChildren(missingValsCountFunc)
  }

  public getSumRecursivelyJustChildren(sumValueFunc) {
    return sumRecursivelyJustChildren<OryTreeNode>(this, node => node.children, sumValueFunc)
  }

  public getSumRecursivelyIncludingThisNode(sumValueFunc) {
    return sumRecursivelyIncludingRoot<OryTreeNode>(this, node => node.children, sumValueFunc)
  }

  /** TODO: move to NumericCell */
  effectiveValueLeft(column: OryColumn) {
    if ( ! this.isDoneOrCancelled ) {
      if ( this.showEffectiveValue(column) ) {
        return this.valueLeftSum(column)
      }
      const estimatedTime = this.getMinutes(column)
      // console.log('estimatedTime for sum', estimatedTime)
      return estimatedTime
    } else {
      return 0
    }
  }

  public getMinutes(column: OryColumn) {
    const columnValue = this.getValueForColumn(column)
    return parseTimeToMinutes(columnValue) || 0
  }

  public getValueForColumn(column: OryColumn) {
    return column.getValueFromItemData(this.itemData)
  }

  /** TODO: move to NumericCell */
  effectiveTimeLeft(column: OryColumn) {
    return this.effectiveDurationText(column)
  }

  /** TODO: move to NumericCell (model class, not component */
  showEffectiveValue(column: OryColumn) {
    const colVal = column.getValueFromItemData(this.itemData)
    // if ( colVal ) console.log('showEffectiveValue colVal', colVal, typeof colVal)
    return ! this.isChildOfRoot &&
      ( /*this.itemData.estimatedTime == null || this.itemData.estimatedTime == undefined || */
        this.getChildrenTimeLeftSum(column) !== 0 /*||
        parseTimeToMinutes(colVal) >= 60*/ // TODO: move to domain-specific code since this deals with time (help reducing this file)
      )
  }

  /** TODO: move to NumericCell */
  effectiveDurationText(column: OryColumn) {
    return this.timeLeftSumText(column)
  }

  /** TODO: move to NumericCell */
  isChildrenEstimationExceedingOwn(column: OryColumn) {
    const colVal = column.getValueFromItemData(this.itemData)
    return ! isEmpty(colVal) &&
      this.valueLeftSum(column) >
      ( colVal && parseTimeToMinutes(colVal)) || 0
  }

  endTime(column: OryColumn) {
    return new Date(this.startTime.getTime() + this.valueLeftSum(column) * 60 * 1000)
  }

  highlight = new class Highlight {
    constructor(public treeNode: OryTreeNode) {}

    isChildOfFocusedNode() {

    }

    isAncestorOfFocusedNode() {
      return (
        this.treeNode.treeModel.focus.lastFocusedNode &&
        this.treeNode.treeModel.focus.lastFocusedNode.getParentsPathArray().some(ancestorOfFocused => {
          return this.treeNode === ancestorOfFocused
        })
      )
    }
  } (this)

  getParentsPathArray(): OryTreeNode[] {
    const ret = []
    let node: OryTreeNode = this
    while (true) {
      if ( ! node ) {
        // debugLog('getAncestorsPathArray', ret)
        return ret.reverse()
      } else {
        ret.push(node)
        node = node.parent2
      }
    }
  }

  getAncestorsPathArray() {
    const pathArray = this.getParentsPathArray()
    return pathArray.slice(0, pathArray.length - 1 /*exclusive - skip last*/)
  }

  getAncestorsPathArrayExcludingVirtualRoot() {
    const ancestorsPathArray = this.getAncestorsPathArray()
    return ancestorsPathArray.slice(1, ancestorsPathArray.length)
  }

  toggleDone() {
    this.patchItemData({
      isDone: this.itemData.isDone ? null : new Date() /* TODO: `this.setDoneNow(! this.isDone)` */ ,
    })
    // FIXME: fireOnChangeItemDataOfChildOnParents and on this

    // TODO: focus node below, but too tied to UI; has to know about column too
  }

  fireOnChangeItemDataOfChildOnParents() {
    debugLog('fireOnChangeItemDataOfChildOnParents')
    for (let parent of this.getParentsPathArray()) {
      parent.onChangeItemDataOfChild.emit()
    }
  }

  navigateInto() {
    this.treeModel.navigation.navigateInto(this)
  }

  findInsertionIndexForNewInclusion(newInclusion: NodeInclusion): number {
    return this.treeModel.nodeOrderer.findInsertionIndexForNewInclusion<OryTreeNode>(this.children, newInclusion, node => {
      return node.nodeInclusion
    })
  }

  indentDecrease() {
    const newParent = this.parent2.parent2
    if ( newParent ) {
      newParent.moveInclusionsHere([this], {beforeNode: this.parent2.getSiblingNodeBelowThis()})
    }
  }

  indentIncrease() {
    const siblingNodeAboveThis = this.getSiblingNodeAboveThis()
    if ( siblingNodeAboveThis ) {
      siblingNodeAboveThis.moveInclusionsHere([this], {beforeNode: undefined})
    }
  }

  hasField(attribute: OryColumn) {
    // return this.dbItem.hasField
    return true // HACK FIXME
  }

  getItemData() {
    // console.log('getItemData', this.itemData)
    return this.itemData
  }

  getId() {
    return this.itemId
  }
}

export abstract class OryTreeListener {
  abstract onAfterNodeMoved()
}

export class TreeCell {
  constructor(
    public node: OryTreeNode,
    public column: OryColumn,
  ) {}
}

export class FocusEvent {
  constructor(
    public cell: TreeCell,
    public options: NodeFocusOptions,
  ) {}
}

export class NodeFocusOptions {
  cursorPosition: number
}


/** =========================================================================== */
/** =========================================================================== */
/** ===========================================================================
 * Idea: have a class that would contain all other classes, e.g. Focus and
 * extract content-specific (what is currently TreeModel),
 * to TreeContents or TreeNodes class for better separation of concerns
 */
@Injectable()
export class TreeModel {

  nodeOrderer = new NodeOrderer()

  /** hardcoded for now, as showing real root-most root is not implemented in UI due to issues */
  isRootShown = false

  navigation = new class Navigation {
    visualRoot: OryTreeNode = null
    visualRoot$ = new ReplaySubject<OryTreeNode>(1)

    constructor(public treeModel: TreeModel) {
    }

    navigateInto(node: OryTreeNode | string) {
      if ( this.visualRoot === node ) {
        return // Prevent navigation if currently navigated-to (visual root) node is the same
      }
      if ( typeof node === 'string' ) {
        node = this.treeModel.getNodesByItemId(node)[0]
      }
      this.visualRoot = node
      this.treeModel.isRootShown = node !== this.treeModel.root
      node.expanded = true
      // this.treeModel.focus.lastFocusedCell.node.
      // this.treeModel.focus.setFocused(node, )
      // TODO: set focused
      this.visualRoot$.next(this.visualRoot)
    }

    navigateToParent() {
      const node = this.visualRoot.parent2
      if ( node ) {
        this.navigateInto(node)
      }
    }

    navigateToRoot() {
      this.navigateInto(this.treeModel.root)
    }

  }(this)

  mapNodeInclusionIdToNodes = new MultiMap<NodeInclusionId, OryTreeNode>()

  mapItemIdToNodes = new MultiMap<ItemId, OryTreeNode>()

  private mapItemById = new Map<ItemId, DbItem>()

  isApplyingFromDbNow = false

  focus = new class Focus {

    /** could skip the "focused" part */
    lastFocusedNode: OryTreeNode
    /** could skip the "focused" part */
    lastFocusedColumn: OryColumn

    // expectedNewNodeToFocus:  = null

    focus$ = new EventEmitter<FocusEvent>()

    get lastFocusedCell() {
      return new TreeCell(this.lastFocusedNode, this.lastFocusedColumn)
    }

    ensureNodeVisibleAndFocusIt(treeNode: OryTreeNode, column: OryColumn, options?: NodeFocusOptions) {
      this.lastFocusedNode = treeNode
      this.lastFocusedColumn = column
      treeNode.expansion.setExpansionOnParentsRecursively(true)
      this.focus$.emit(new FocusEvent(this.lastFocusedCell, options))
    }
  }

  /** Workaround for now, as there were some non-deleted children of a deleted parent */
  public showDeleted: boolean = false

  permissionsManager: PermissionsManager

  dataItemsService = this.injector.get(DataItemsService)

  /** Init last, because OryTreeNode depends on stuff from TreeModel */
  root: OryTreeNode = new OryTreeNode(null, this.treeService.HARDCODED_ROOT_NODE_ITEM_ID, this, null)

  constructor(
    public injector: Injector,
    /* TODO Rename to dbTreeService */
    public treeService: DbTreeService,
    public authService: AuthService,
    public treeListener: OryTreeListener,
  ) {
    this.addNodeToMapByItemId(this.root)
    this.permissionsManager = new PermissionsManager(this.authService.userId)
    this.navigation.navigateToRoot()
  }

  /* TODO: unify onNodeAdded, onNodeInclusionModified; from OryTreeNode: moveInclusionsHere, addAssociationsHere, addChild, _appendChildAndSetThisAsParent,
   * reorder(). In general unify reordering with moving/copying inclusions and adding nodes */

  obtainItemById(itemId: ItemId): DbItem {
    let item = this.mapItemById.get(itemId)
    if ( ! item ) {
      item = new DbItem(itemId)
      this.mapItemById.set(itemId, item)
    }
    return item
  }

  onNodeAdded(event: NodeAddEvent) {
    debugLog('onNodeAdded NodeAddEvent', event)
    const nodeInclusionId = event.nodeInclusion.nodeInclusionId
    const existingNodes = this.mapNodeInclusionIdToNodes.get(nodeInclusionId)
    try {
      this.isApplyingFromDbNow = true
      if ( existingNodes && existingNodes.length > 0 ) {
        traceLog('node(s) for inclusion already exist(s): ', nodeInclusionId)
        for ( const existingNode of existingNodes ) {
          // setTimeout(() => {
          //   setTimeout(() => {
          // setTimeout to avoid "ExpressionChangedAfterItHasBeenCheckedError" in NodeContentComponent.html
          existingNode.itemData = event.itemData
          traceLog('existingNode.onChangeItemData.emit(event.itemData)', existingNode, existingNode.itemData)

          existingNode.onChangeItemData.emit(event.itemData)
          existingNode.fireOnChangeItemDataOfChildOnParents()
          // TODO: unify with the else branch and emit onChangeItemData* stars there too
          // })
          // }, 0)
        }
      } else {
        // node with inclusion does not yet exist
        if ( ! event.itemData.deleted || this.showDeleted ) {
          const parentNodes = this.mapItemIdToNodes.get(event.directParentItemId)
          traceLog('onNodeAdded parentNodes', parentNodes)
          if ( ! parentNodes ) {
            console.log('onNodeAdded: no parent', event.directParentItemId)
          } else {
            for (const parentNode of parentNodes) {
              let insertBeforeIndex = parentNode.findInsertionIndexForNewInclusion(event.nodeInclusion)

              const newTreeNode = new OryTreeNode(event.nodeInclusion, event.itemId, this, event.itemData)
              parentNode._appendChildAndSetThisAsParent(newTreeNode, insertBeforeIndex)
              this.dataItemsService.onItemWithDataAdded$.next(newTreeNode)
              // console.log('onItemWithDataAdded$.next(newTreeNode)')
            }
          }
        }
      }
    } finally {
      this.isApplyingFromDbNow = false
    }
  }

  /* Can unify this with moveInclusionsHere() */
  onNodeInclusionModified(nodeInclusionId: NodeInclusionId, nodeInclusionData, newParentItemId: ItemId) {
    // TODO: ensure this same code is executed locally immediately after reorder/move, without waiting for DB
    // if ( nodeInclusionData.parentNode)
    const nodes: OryTreeNode[] | undefined = this.mapNodeInclusionIdToNodes.get(nodeInclusionId)
    for (const node of nodes) {
      // if ( node.parent2.itemId !== newParentItemId ) {
      // change parent
      node.parent2._removeChild(node)
      const newParents = this.mapItemIdToNodes.get(newParentItemId)
      // FIXME: need to create new node instead of moving existing
      debugLog('onNodeInclusionModified newParents.length', newParents.length)
      if ( newParents && newParents.length > 1 ) {
        debugLog('FIXME: onNodeInclusionModified moving node and there are multiple new parents - not yet impl.! newParents', newParents, 'length', newParents.length)
        window.alert('FIXME: onNodeInclusionModified moving node and there are multiple new parents - not yet impl.!')
      }
      for ( const newParent of newParents ) {
        const insertionIndex = newParent.findInsertionIndexForNewInclusion(nodeInclusionData)

        newParent._appendChildAndSetThisAsParent(node, insertionIndex)
      }
      node.nodeInclusion = nodeInclusionData
    }

    // } else { /* same parent */
    //   node.nodeInclusion = nodeInclusionData
    //   const insertionIndex = node.parent2.findInsertionIndexForNewInclusion(node.nodeInclusion)
    //   node.parent2.children.splice(insertionIndex, 0, node)
    //   // node.parent2.children = sortBy(node.parent2.children, item => item.nodeInclusion.orderNum)
      this.treeListener.onAfterNodeMoved()
    // }
  }

  registerNode(nodeToRegister: OryTreeNode) {
    this.mapNodeInclusionIdToNodes.add(nodeToRegister.nodeInclusion.nodeInclusionId, nodeToRegister)
    this.addNodeToMapByItemId(nodeToRegister)
  }

  private addNodeToMapByItemId(nodeToRegister: OryTreeNode) {
    this.mapItemIdToNodes.add(nodeToRegister.itemId, nodeToRegister)
  }

  getNodesByItemId(itemId: ItemId) {
    const nodes: OryTreeNode[] = this.mapItemIdToNodes.get(itemId)
    return nodes
  }

}
