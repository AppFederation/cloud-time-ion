import {OryTreeNode} from './TreeModel'
import {DbTreeListener} from './TreeListener'

export abstract class DbTreeService {
  abstract addSiblingAfterNode(newNode: OryTreeNode, afterExistingNode: OryTreeNode, previousOrderNumber, newOrderNumber, nextOrderNumber)
  abstract loadNodesTree(listener: DbTreeListener)
}
