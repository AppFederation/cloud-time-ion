import {TreeNode} from 'primeng/primeng'
import {NodeAddEvent, NodeInclusion} from './TreeListener'
import {debugLog, FirestoreTreeService} from './firestore-tree.service'
import {after} from 'selenium-webdriver/testing'
import {DbTreeService} from './db-tree-service'
import {EventEmitter, Injectable} from '@angular/core'
import {isNullOrUndefined} from 'util'
import {defined, FIXME, nullOrUndef} from './utils'
import {sortBy} from 'lodash';
import {sumBy} from 'lodash';


/**
 * Created by kd on 2017-10-27.
 *
 * NOTE: this file has both TreeModel and TreeNode to avoid a warning about circular dependency between files.
 * Maybe I will find a better way, perhaps involving refactor...
 */

const uuidV4 = require('uuid/v4');


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

  // ==== End of PrimeNG's TreeNode

  static INITIAL_TITLE = ''

  get lastChildNode(): OryTreeNode {
    return this.getChildAtIndexOrNull(this.children && this.children.length - 1)
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
    return this.parent2.children.indexOf(this)
  }

  getNodeAboveThis() {
    const index = this.getIndexInParent()
    return this.parent2.getChildAtIndexOrNull(index - 1)
  }

  getNodeBelowThis() {
    const index = this.getIndexInParent()
    console.log('getNodeBelow index', index, 'count', this.parent2.children.length)
    const childAtIndexOrNull = this.parent2.getChildAtIndexOrNull(index + 1)
    console.log('getNodeBelow childAtIndexOrNull', childAtIndexOrNull)
    return childAtIndexOrNull
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

  addChild(afterExistingNode?: OryTreeNode, newNode?: OryTreeNode) {
    if ( ! afterExistingNode && this.children.length > 0 ) {
      afterExistingNode = this.lastChildNode
    }

    // console.log('addChild, afterExistingNode', afterExistingNode)
    newNode = newNode || new OryTreeNode(null, 'item_' + uuidV4(), this.treeModel, this.newItemData())

    const nodeBelow = afterExistingNode && afterExistingNode.getNodeBelowThis()
    // console.log('addChild: nodeBelow', nodeBelow)
    const previousOrderNumber = afterExistingNode && afterExistingNode.nodeInclusion.orderNum;
    // console.log('addChild: previousOrderNumber', previousOrderNumber)
    const nextOrderNumber = nodeBelow && nodeBelow.nodeInclusion.orderNum
    // console.log('addChild: nextOrderNumber', nextOrderNumber)
    const newOrderNumber = DbTreeService.calculateNewOrderNumber(previousOrderNumber, nextOrderNumber)
    // console.log('addChild: newOrderNumber', newOrderNumber)
    const nodeInclusion: NodeInclusion = new NodeInclusion(newOrderNumber, 'inclusion_' + uuidV4())
    newNode.nodeInclusion = nodeInclusion


    this.treeModel.treeService.addSiblingAfterNode(newNode, afterExistingNode, previousOrderNumber, newOrderNumber, nextOrderNumber)

    const newNodeIndex = afterExistingNode ? afterExistingNode.getIndexInParent() + 1 : 0
    this._appendChild(newNode, newNodeIndex)
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
    // TODO: if topmost, reorder to last item in this plan or to previous plan
    const newOrderNum = DbTreeService.calculateNewOrderNumber(
      this.getNodeAboveThis() &&
      this.getNodeAboveThis().getNodeAboveThis() &&
      this.getNodeAboveThis().getNodeAboveThis().nodeInclusion.orderNum,
      this.getNodeAboveThis() &&
      this.getNodeAboveThis().nodeInclusion.orderNum
    )
    this.reorderToOrderNum(newOrderNum)
  }

  reorderDown() {
    const newOrderNum = DbTreeService.calculateNewOrderNumber(
      this.getNodeBelowThis() &&
      this.getNodeBelowThis().nodeInclusion.orderNum,
      this.getNodeBelowThis() &&
      this.getNodeBelowThis().getNodeBelowThis() &&
      this.getNodeBelowThis().getNodeBelowThis().nodeInclusion.orderNum
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

}

export abstract class OryTreeListener {
  abstract onAfterReorder()
}

/** =========================================================================== */
@Injectable()
export class TreeModel {

  root: OryTreeNode = new OryTreeNode(null, this.treeService.HARDCODED_ROOT_NODE, this, null)
  startTime = new Date()


  mapNodeInclusionIdToNode = new Map<string, OryTreeNode>()
  isApplyingFromDbNow = false

  constructor(
    public treeService: DbTreeService,
    public treeListener: OryTreeListener,
  ) {}

  onNodeAdded(event: NodeAddEvent) {
    // console.log('onNodeAdded', event)
    const nodeInclusionId = event.nodeInclusion.nodeInclusionId
    const existingNode = this.mapNodeInclusionIdToNode.get(nodeInclusionId)
    try {
      this.isApplyingFromDbNow = true
      if (existingNode) {
        console.log('node inclusion already exists: ', nodeInclusionId)
        // setTimeout(() => {
        //   setTimeout(() => {
            // setTimeout to avoid "ExpressionChangedAfterItHasBeenCheckedError" in NodeContentComponent.html
            existingNode.itemData = event.itemData
            existingNode.onChangeItemData.emit(event.itemData)
          // })
        // }, 0)

      } else {
        if ( ! event.itemData.deleted ) {
          const parentNode = this.root;
          FIXME('Hardcoded parent (root) for now')
          const newOrderNum = event.nodeInclusion.orderNum
          let insertBeforeIndex = parentNode.findInsertionIndexForNewOrderNum(newOrderNum)

          const newTreeNode = new OryTreeNode(event.nodeInclusion, event.itemId, this, event.itemData)
            parentNode._appendChild(newTreeNode, insertBeforeIndex)
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
    // re-sort root
    const node: OryTreeNode | undefined = this.mapNodeInclusionIdToNode.get(nodeInclusionId)
    node.nodeInclusion = nodeInclusionData
    this.root.children = sortBy(this.root.children, item => item.nodeInclusion.orderNum)
    this.treeListener.onAfterReorder()
  }

  // addSiblingAfterNode(newNode: OryTreeNode, afterExistingNode: OryTreeNode) {
  //
  //
  //   const myIndex = this.getIndexInParent()
  //
  //
  //
  //
  // }

  registerNode(nodeToRegister: OryTreeNode) {
    // console.log('mapNodeInclusionIdToNode registerNode', nodeToRegister)
    // NOTE: does not yet support the same node being in multiple places
    // NOTE: this should register nodeInclusion id

    this.mapNodeInclusionIdToNode.set(nodeToRegister.nodeInclusion.nodeInclusionId, nodeToRegister)
  }

  private nodeInclusionExists(nodeInclusionId: string) {
    const existingNode = this.mapNodeInclusionIdToNode.get(nodeInclusionId)
    // console.log('mapNodeInclusionIdToNode nodeInclusionExists: ', nodeInclusionId, existingNode)
    return defined(existingNode)
  }


  timeLeftSumText() {
    const minutesTotalLeft = this.timeLeftSum()
    const hours = Math.floor(minutesTotalLeft / 60)
    const minutesUpTo60 = minutesTotalLeft % 60
    return `${hours} h ${minutesUpTo60} mins`
  }

  timeLeftSum() {
    const sumBy1 = sumBy(this.root.children, item => {
      if (!item.itemData.isDone) {
        const estimatedTime = parseFloat(item.itemData.estimatedTime) || 0
        // console.log('estimatedTime for sum', estimatedTime)
        return estimatedTime
      } else {
        return 0
      }
    })
    return sumBy1
  }

  endTime() {
    return new Date(this.startTime.getTime() + this.timeLeftSum() * 60 * 1000)
  }

}
