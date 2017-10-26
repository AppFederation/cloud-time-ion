import { Injectable } from '@angular/core';
import {TreeNode} from 'primeng/primeng'


export class OryTreeNode implements TreeNode {
  dbId

  // from TreeNode:

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

}

export class NodeInclusion {
  constructor(
    public orderThisBeforeId,
    public orderThisAfterId,
    public orderNum,
  ) {}
}

export class NodeAddEvent {
  constructor (
    public parents,
    public immediateParentId,
    public node,
    public id,
    public pendingListeners: number,
    public nodeInclusion: NodeInclusion
  ) {}
}

export abstract class DbTreeListener {
  abstract onNodeAdded(NodeAddEvent)
}


export class TreeModel {

  root: OryTreeNode = new OryTreeNode()

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
    const newNode: OryTreeNode = {
      dbId: event.id
    }
    children.splice(orderBeforeIndex, 0, newNode)

  }

}


@Injectable()
export class TreeService {

  constructor() { }

}
