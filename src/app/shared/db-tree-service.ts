import {OryTreeNode} from './TreeModel'

export abstract class DbTreeService {
  abstract addSiblingAfterNode(newNode: OryTreeNode, afterExistingNode: OryTreeNode, previousOrderNumber, newOrderNumber, nextOrderNumber)
}
