import {TreeNode} from 'primeng/primeng'
import {NodeAddEvent, NodeInclusion} from './TreeListener'
import {debugLog} from './firestore-tree.service'
/**
 * Created by kd on 2017-10-27.
 */

export class OryTreeNode implements TreeNode {

  treeModel: TreeModel

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
  /** because `parent` is reset to null by the tree component if the node is top-level */
  parent2?: OryTreeNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;

  constructor(
    public nodeInclusion: NodeInclusion,
    public dbId,
  ) {}

  addSiblingAfterThis() {
    // window.alert('my index z')
    console.log('this.parent', this.parent)
    const myIndex = this.getIndexInParent()
    this.parent2.appendChild(new OryTreeNode(null, 'someIdFIXME'), myIndex + 1)
    // window.alert('my index' + myIndex)
    // getNodeBelowThis()
  }

  public getIndexInParent() {
    return this.parent2.children.indexOf(this)
  }

  public getNodeBelowThis() {
    const children = this.parent2.children

  }

  appendChild(node: OryTreeNode, insertBeforeIndex?: number) {
    insertBeforeIndex = insertBeforeIndex || this.children.length
    console.log('this', this)
    if ( ! this.children ) {
      this.children = []
    }
    node.parent = this
    node.parent2 = this
    console.log('node.parent', node.parent)
    console.log('push child', node.parent)
    // this.children.push(node)
    this.children.splice(insertBeforeIndex, 0, node)

  }
}


export class TreeModel {

  root: OryTreeNode = new OryTreeNode(null, null)

  mapIdToNode = new Map<string, TreeNode>()

  onNodeAdded(event: NodeAddEvent) {
    debugLog('onNodeAdded')
    const root = this.root
    const nodeInclusion = event.nodeInclusion
    let parentNode
    if ( ! event.immediateParentId ) {
      parentNode = root
    } else {
      throw new Error('not yet implemented: adding node to non-root')
    }
    let children = root.children
    if ( ! children ) {
      children = []
      root.children = children
    }
    let orderBeforeIndex: number
    const orderThisAfterId = nodeInclusion.orderThisAfterId
    const orderThisBeforeId = nodeInclusion.orderThisBeforeId
    if ( ! orderThisAfterId ) {
      // zero-th
      orderBeforeIndex = 0
    } else if ( ! orderThisBeforeId ) {
      // zero-th
      orderBeforeIndex = children.length
    } else {
      orderBeforeIndex = children.findIndex((existingNode) => {
        return existingNode.dbId === nodeInclusion.orderThisBeforeId
      })
    }
    const newNode: OryTreeNode = new OryTreeNode(
      event.nodeInclusion,
      event.id,
    )
    children.splice(orderBeforeIndex, 0, newNode)

  }

}
