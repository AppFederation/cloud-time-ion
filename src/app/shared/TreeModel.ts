import {TreeNode} from 'primeng/primeng'
import {NodeAddEvent, NodeInclusion} from './TreeListener'
import {debugLog} from './log'
import {after} from 'selenium-webdriver/testing'
import {DbTreeService} from './db-tree-service'
import {EventEmitter, Injectable} from '@angular/core'
import {isNullOrUndefined} from 'util'
import {defined, nullOrUndef} from './utils'
import {sortBy} from 'lodash';
import {sumBy} from 'lodash';
import { OryColumn } from '../tree/OryColumn'
import { FIXME } from './log'


/**
 * Created by kd on 2017-10-27.
 *
 * NOTE: this file has both TreeModel and TreeNode to avoid a warning about circular dependency between files.
 * Maybe I will find a better way, perhaps involving refactor...
 */

const uuidV4 = require('uuid/v4');


/** ======================================================================================= */
/** ======================================================================================= */
/** ======================================================================================= */
export class OryTreeNode implements TreeNode {

  // ==== from PrimeNG's TreeNode:

  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  children?: OryTreeNode[] = [];
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

  onChangeItemData = new EventEmitter()

  startTime = new Date()


  // ==== End of PrimeNG's TreeNode

  static INITIAL_TITLE = ''

  expansion = new class Expansion {
    constructor(public treeNode: OryTreeNode) {}

    setExpansionOnParentsRecursively(expandToSet: boolean) {
      this.treeNode.getAncestorsPathArray().forEach(node => {
        node.expanded = expandToSet
      })
    }

    areParentsExpandedToMakeThisNodeVisible(): boolean {
      if ( this.treeNode.isRoot() ) {
        return this.treeNode.treeModel.isRootShown
      }
      // return false
      return this.treeNode.getAncestorsPathArrayExcludingVirtualRoot().every(node => {
        return node.expanded
      })
    }

    setExpansion(expansionState: boolean, recursive: boolean) {
      this.treeNode.expanded = expansionState
      if ( recursive ) {
        this.treeNode.children.forEach( (node: OryTreeNode) => {
          node.expansion.setExpansion(expansionState, recursive);
        });
      }
    }

    toggleExpansion(recursive: boolean) {
      this.setExpansion(! this.treeNode.expanded, recursive)
    }

  }(this)

  get lastChildNode(): OryTreeNode {
    return this.getChildAtIndexOrNull(this.children && this.children.length - 1)
  }

  get isDayPlan() {
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
    // // window.alert('my index z')
    // console.log('this.parent', this.parent)
    // const newNode = this.treeModel.addSiblingAfterNode(newNode, this)
    // // window.alert('my index' + myIndex)
    // // getNodeBelowThis()
    // return newNode
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
    if ( this.isRoot() ) {
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
    const lastImmediateChild = this.getLastImmediateChild()
    if ( lastImmediateChild && ! lastImmediateChild.expansion.areParentsExpandedToMakeThisNodeVisible() ) {
      return this // we stop at this because deeper one is not visible
    }
    if ( lastImmediateChild ) {
      return lastImmediateChild.getLastMostNestedVisibleNodeRecursively()
    } else {
      return this
    }
  }

  public getLastImmediateChild() {
    return this.children && this.children.length > 0 && this.children[this.children.length - 1]
  }


  _appendChild(nodeToAppend?: OryTreeNode, insertBeforeIndex?: number) {
    if ( ! nodeToAppend ) {
      nodeToAppend = new OryTreeNode(null, '' + uuidV4(), this.treeModel, this.newItemData())
    }
    const afterNode = this.lastChildNode

    if ( nullOrUndef(insertBeforeIndex) ) {
      insertBeforeIndex = this.children.length
    }
    // console.log('this', this)
    if ( nullOrUndef(this.children) ) {
      this.children = []
    }
    nodeToAppend.parent = this
    nodeToAppend.parent2 = this
    // console.log('node.parent', nodeToAppend.parent)
    // console.log('push child', nodeToAppend.parent)
    // this.children.push(node)
    this.children.splice(insertBeforeIndex, 0, nodeToAppend)
    this.treeModel.registerNode(nodeToAppend)
    // console.log('afterNode', afterNode)
    // this.treeModel.addSiblingAfterNode(nodeToAppend, afterNode)

    return nodeToAppend

    /// ======

  }

  private newItemData() {
    return {title: OryTreeNode.INITIAL_TITLE}
  }


  getChildAtIndexOrNull(index: number): OryTreeNode {
    if ( this.isIndexPresent(index) ) {
      return this.children[index]
    } else {
      return null
    }
  }

  private isIndexPresent(index: number): boolean {
    const lastIndex = this.children.length - 1
    if ( index < 0 || index > lastIndex ) {
      return false
    } else {
      return true
    }
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
    const previousOrderNumber = afterExistingNode && afterExistingNode.nodeInclusion.orderNum;
    // console.log('addChild: previousOrderNumber', previousOrderNumber)
    const nextOrderNumber = nodeBelow && nodeBelow.nodeInclusion.orderNum
    // console.log('addChild: nextOrderNumber', nextOrderNumber)
    const newOrderNumber = DbTreeService.calculateNewOrderNumber(previousOrderNumber, nextOrderNumber)
    // console.log('addChild: newOrderNumber', newOrderNumber)
    const nodeInclusion: NodeInclusion = new NodeInclusion(newOrderNumber, 'inclusion_' + uuidV4())
    newNode.nodeInclusion = nodeInclusion


    this.treeModel.treeService.addSiblingAfterNode(this, newNode, afterExistingNode, previousOrderNumber, newOrderNumber, nextOrderNumber)

    const newNodeIndex = afterExistingNode ? afterExistingNode.getIndexInParent() + 1 : 0
    this._appendChild(newNode, newNodeIndex) // this is to avoid delay caused by Firestore; for UX
    return newNode
  }

  findInsertionIndexForNewOrderNum(newOrderNum: number): number {
    let foundIndex = this.children.findIndex((node) => {
      const existingOrderNum = node.nodeInclusion.orderNum
      return existingOrderNum > newOrderNum
    })
    if ( foundIndex < 0 ) {
      // newIndex is higher than any existing
      foundIndex = this.children.length
    }
    return foundIndex
  }

  patchItemData(itemData: any) {
    this.treeModel.treeService.patchItemData(this.itemId, itemData)
  }

  reorderUp() {
    // TODO: if topmost, reorder to last
    // TODO: if topmost, reorder to last item in this plan or to previous plan
    const newOrderNum = DbTreeService.calculateNewOrderNumber(
      this.getSiblingNodeAboveThis() &&
      this.getSiblingNodeAboveThis().getSiblingNodeAboveThis() &&
      this.getSiblingNodeAboveThis().getSiblingNodeAboveThis().nodeInclusion.orderNum,
      this.getSiblingNodeAboveThis() &&
      this.getSiblingNodeAboveThis().nodeInclusion.orderNum
    )
    this.reorderToOrderNum(newOrderNum)
  }

  reorderDown() {
    // TODO: if bottommost, reorder to topmost
    const newOrderNum = DbTreeService.calculateNewOrderNumber(
      this.getSiblingNodeBelowThis() &&
      this.getSiblingNodeBelowThis().nodeInclusion.orderNum,
      this.getSiblingNodeBelowThis() &&
      this.getSiblingNodeBelowThis().getSiblingNodeBelowThis() &&
      this.getSiblingNodeBelowThis().getSiblingNodeBelowThis().nodeInclusion.orderNum
    )
    this.reorderToOrderNum(newOrderNum)
  }

  private reorderToOrderNum(newOrderNum) {
    debugLog('newOrderNum', newOrderNum)
    debugLog('this.parent2', this.parent2)
    this.treeModel.treeService.patchChildInclusionData(
      this.parent2.itemId,
      this.nodeInclusion.nodeInclusionId,
      {
        orderNum: newOrderNum,
      },
    )
  }

  // ======================================================
  // TODO: extract classes like TaskNodeContent, DayPlanNodeContent
  // since nodes are to allow changing their type, we would just swap an instance of the class mentioned above
  // the separation first would be mainly to separate generic node-logic from time-planning specific, etc.

  timeLeftSumText() {
    const minutesTotalLeft = this.timeLeftSum()
    const hours = Math.floor(minutesTotalLeft / 60)
    const minutesUpTo60 = minutesTotalLeft % 60
    return `${hours}h ${minutesUpTo60}m`
  }

  timeLeftSum() {
    if ( this.children.length ) {
      // debugLog('timeLeftSum this.children', this.children)
    }
    const sumBy1 = sumBy(this.children, childNode => {
      return childNode.effectiveTimeLeft()
    })
    return sumBy1
  }

  effectiveTimeLeft() {
    if ( ! this.itemData.isDone ) {
      if ( this.showEffectiveDuration() ) {
        return this.timeLeftSum()
      }
      const estimatedTime = parseFloat(this.itemData.estimatedTime) || 0
      // console.log('estimatedTime for sum', estimatedTime)
      return estimatedTime
    } else {
      return 0
    }
  }

  showEffectiveDuration() {
    return this.timeLeftSum() !== 0
  }

  effectiveDurationText() {
    return this.timeLeftSumText()
  }

  endTime() {
    return new Date(this.startTime.getTime() + this.timeLeftSum() * 60 * 1000)
  }

  highlight = new class Highlight {
    constructor(public treeNode: OryTreeNode) {}

    isChildOfFocusedNode() {

    }

    isAncestorOfFocusedNode() {
      return (
        this.treeNode.treeModel.focus.lastFocusedNode &&
        this.treeNode.treeModel.focus.lastFocusedNode.getPathArray().some(ancestorOfFocused => {
          return this.treeNode === ancestorOfFocused
        })
      )
    }
  } (this)

  getPathArray(): OryTreeNode[] {
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
    const pathArray = this.getPathArray()
    return pathArray.slice(0, pathArray.length - 1 /*exclusive - skip last*/)
  }

  getAncestorsPathArrayExcludingVirtualRoot() {
    const ancestorsPathArray = this.getAncestorsPathArray()
    return ancestorsPathArray.slice(1, ancestorsPathArray.length)
  }

  isRoot() {
    return this.treeModel.root === this;
  }

  toggleDone() {
    this.patchItemData({
      isDone: ! this.itemData.isDone,
    })
    // TODO: focus node below, but too tied to UI
  }
}

export abstract class OryTreeListener {
  abstract onAfterReorder()
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
  ) {}
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

  root: OryTreeNode = new OryTreeNode(null, this.treeService.HARDCODED_ROOT_NODE_ITEM_ID, this, null)

  mapNodeInclusionIdToNode = new Map<string, OryTreeNode>()
  mapItemIdToNode = new Map<string, OryTreeNode>()
  isApplyingFromDbNow = false

  focus = new class Focus {
    /** could skip the "focused" part */
    lastFocusedNode: OryTreeNode
    /** could skip the "focused" part */
    lastFocusedColumn: OryColumn

    // expectedNewNodeToFocus:  = null

    focus$ = new EventEmitter<FocusEvent>()

    get lastCell() {
      return new TreeCell(this.lastFocusedNode, this.lastFocusedColumn)
    }

    setFocused(treeNode: OryTreeNode, column: OryColumn) {
      this.lastFocusedNode = treeNode
      this.lastFocusedColumn = column
      this.focus$.emit(new FocusEvent(this.lastCell))
    }
  }

  /* Workaround for now, as there were some non-deleted children of a deleted parent */
  public showDeleted: boolean = true

  /** hardcoded for now, as showing real root-most root is not implemented in UI due to issues */
  isRootShown = false

  constructor(
    public treeService: DbTreeService,
    public treeListener: OryTreeListener,
  ) {}

  onNodeAdded(event: NodeAddEvent) {
    debugLog('onNodeAdded', event)
    const nodeInclusionId = event.nodeInclusion.nodeInclusionId
    const existingNode = this.mapNodeInclusionIdToNode.get(nodeInclusionId)
    try {
      this.isApplyingFromDbNow = true
      if (existingNode) {
        debugLog('node inclusion already exists: ', nodeInclusionId)
        // setTimeout(() => {
        //   setTimeout(() => {
            // setTimeout to avoid "ExpressionChangedAfterItHasBeenCheckedError" in NodeContentComponent.html
            existingNode.itemData = event.itemData
            debugLog('existingNode.onChangeItemData.emit(event.itemData)', existingNode, existingNode.itemData)
            existingNode.onChangeItemData.emit(event.itemData)
          // })
        // }, 0)

      } else {
        if ( ! event.itemData.deleted || this.showDeleted ) {
          const parentNode = event.immediateParentId === this.treeService.HARDCODED_ROOT_NODE_ITEM_ID ? this.root : this.mapItemIdToNode.get(event.immediateParentId)
          if ( ! parentNode ) {
            console.error('onNodeAdded: no parent', event.immediateParentId)
          } else {
            // FIXME('Hardcoded parent (root) for now')
            const newOrderNum = event.nodeInclusion.orderNum
            let insertBeforeIndex = parentNode.findInsertionIndexForNewOrderNum(newOrderNum)

            const newTreeNode = new OryTreeNode(event.nodeInclusion, event.itemId, this, event.itemData)
            parentNode._appendChild(newTreeNode, insertBeforeIndex)
          }
        }
      }
    } finally {
      this.isApplyingFromDbNow = false
    }

    // debugLog('onNodeAdded')
    // const root = this.root
    // const nodeInclusion = event.nodeInclusion
    // let parentNode
    // if ( ! event.immediateParentId ) {
    //   parentNode = root
    // } else {
    //   throw new Error('not yet implemented: adding node to non-root')
    // }
    // let children = root.children
    // if ( ! children ) {
    //   children = []
    //   root.children = children
    // }
    // let orderBeforeIndex: number
    // const orderThisAfterId = nodeInclusion.orderThisAfterId
    // const orderThisBeforeId = nodeInclusion.orderThisBeforeId
    // if ( ! orderThisAfterId ) {
    //   // zero-th
    //   orderBeforeIndex = 0
    // } else if ( ! orderThisBeforeId ) {
    //   // zero-th
    //   orderBeforeIndex = children.length
    // } else {
    //   orderBeforeIndex = children.findIndex((existingNode) => {
    //     return existingNode.dbId === nodeInclusion.orderThisBeforeId
    //   })
    // }
    // const newNode: OryTreeNode = new OryTreeNode(
    //   event.nodeInclusion,
    //   event.id,
    //   this,
    // )
    // children.splice(orderBeforeIndex, 0, newNode)

  }

  onNodeInclusionModified(nodeInclusionId, nodeInclusionData) {
    const node: OryTreeNode | undefined = this.mapNodeInclusionIdToNode.get(nodeInclusionId)
    node.nodeInclusion = nodeInclusionData
    // re-sort:
    node.parent2.children = sortBy(node.parent2.children, item => item.nodeInclusion.orderNum)
    this.treeListener.onAfterReorder()
  }

  // addSiblingAfterNode(newNode: OryTreeNode, afterExistingNode: OryTreeNode) {
  //   const myIndex = this.getIndexInParent()
  // }

  registerNode(nodeToRegister: OryTreeNode) {
    // console.log('mapNodeInclusionIdToNode registerNode', nodeToRegister)
    // NOTE: does not yet support the same node being in multiple places
    // NOTE: this should register nodeInclusion id

    this.mapNodeInclusionIdToNode.set(nodeToRegister.nodeInclusion.nodeInclusionId, nodeToRegister)
    this.mapItemIdToNode.set(nodeToRegister.itemId, nodeToRegister)
  }

  private nodeInclusionExists(nodeInclusionId: string) {
    const existingNode = this.mapNodeInclusionIdToNode.get(nodeInclusionId)
    // console.log('mapNodeInclusionIdToNode nodeInclusionExists: ', nodeInclusionId, existingNode)
    return defined(existingNode)
  }

}
