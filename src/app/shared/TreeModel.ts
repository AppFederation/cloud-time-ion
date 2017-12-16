import {TreeNode} from 'primeng/primeng'
import {NodeAddEvent, NodeInclusion} from './TreeListener'
import {debugLog, FirestoreTreeService} from './firestore-tree.service'
import {after} from 'selenium-webdriver/testing'
import {DbTreeService} from './db-tree-service'
import {Injectable} from '@angular/core'
/**
 * Created by kd on 2017-10-27.
 */

const uuidV4 = require('uuid/v4');


export class OryTreeNode implements TreeNode {

  // from PrimeNG's TreeNode:

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
   * Possibly rename to parentEvenIfRoot */
  parent2?: OryTreeNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  get lastChildNode(): OryTreeNode {
    return this.getChildAtIndexOrNull(this.children && this.children.length - 1)
  }

  constructor(
    public nodeInclusion: NodeInclusion,
    public dbId,
    public treeModel: TreeModel,
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
      nodeToAppend = new OryTreeNode(null, '' + uuidV4(), this.treeModel)
    }
    const afterNode = this.lastChildNode
    insertBeforeIndex = insertBeforeIndex || this.children.length
    console.log('this', this)
    if ( ! this.children ) {
      this.children = []
    }
    nodeToAppend.parent = this
    nodeToAppend.parent2 = this
    console.log('node.parent', nodeToAppend.parent)
    console.log('push child', nodeToAppend.parent)
    // this.children.push(node)
    this.children.splice(insertBeforeIndex, 0, nodeToAppend)
    console.log('afterNode', afterNode)
    // this.treeModel.addSiblingAfterNode(nodeToAppend, afterNode)

    return nodeToAppend

    /// ======

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

    console.log('addChild, afterExistingNode', afterExistingNode)
    newNode = newNode || new OryTreeNode(null, 'node_' + uuidV4(), this.treeModel)

    const nodeBelow = afterExistingNode && afterExistingNode.getNodeBelowThis()
    console.log('addChild: nodeBelow', nodeBelow)
    const previousOrderNumber = afterExistingNode && afterExistingNode.nodeInclusion.orderNum;
    console.log('addChild: previousOrderNumber', previousOrderNumber)
    const nextOrderNumber = nodeBelow && nodeBelow.nodeInclusion.orderNum
    console.log('addChild: nextOrderNumber', nextOrderNumber)
    const newOrderNumber = FirestoreTreeService.calculateNewOrderNumber(previousOrderNumber, nextOrderNumber)
    console.log('addChild: newOrderNumber', newOrderNumber)
    const nodeInclusion: NodeInclusion = new NodeInclusion(newOrderNumber, 'inclusion_' + uuidV4())
    newNode.nodeInclusion = nodeInclusion


    this.treeModel.treeService.addSiblingAfterNode(newNode, afterExistingNode, previousOrderNumber, newOrderNumber, nextOrderNumber)

    const newNodeIndex = afterExistingNode ? afterExistingNode.getIndexInParent() + 1 : 0
    this._appendChild(newNode, newNodeIndex)
    return newNode
  }
}


@Injectable()
export class TreeModel {

  root: OryTreeNode = new OryTreeNode(null, null, this)

  mapIdToNode = new Map<string, TreeNode>()

  constructor(
    public treeService: DbTreeService
  ) {}

  onNodeAdded(event: NodeAddEvent) {
    console.log('onNodeAdded', event)
    this.root._appendChild(new OryTreeNode(event.nodeInclusion, event.id, this), 0)
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

  // addSiblingAfterNode(newNode: OryTreeNode, afterExistingNode: OryTreeNode) {
  //
  //
  //   const myIndex = this.getIndexInParent()
  //
  //
  //
  //
  // }

}
