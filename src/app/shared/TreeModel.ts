import {TreeNode} from 'primeng/primeng'
import {NodeAddEvent, NodeInclusion} from './TreeListener'
/**
 * Created by kd on 2017-10-27.
 */

export class OryTreeNode implements TreeNode {

  nodeInclusion: NodeInclusion


  dbId

  treeModel: TreeModel

  // from PrimeNG's TreeNode:

  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  children?: OryTreeNode[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: TreeNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;

  addSiblingAfterThis()

}


export class TreeModel {

  root: OryTreeNode = new OryTreeNode()

  mapIdToNode = new Map<string, TreeNode>()

  onNodeAdded(event: NodeAddEvent) {
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
    const newNode: OryTreeNode = new OryTreeNode() {
      nodeInclusion: event.nodeInclusion,
      dbId: event.id,
    }
    children.splice(orderBeforeIndex, 0, newNode)

  }

}
