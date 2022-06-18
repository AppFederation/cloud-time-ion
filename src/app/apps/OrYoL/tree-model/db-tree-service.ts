import {OryTreeNode} from './TreeModel'
import {DbTreeListener} from './TreeListener'

/* TODO: write new db code in such a way to not depend on tree-model stuff (e.g. pass ItemId (==string) instead of OryTreeNode) */
/* TODO: use ItemData and ItemInclusionData (== any) placeholder types instead of `any` */

export abstract class DbTreeService {

  // HARDCODED_ROOT_NODE_ITEM_ID = 'KarolNodesHardcoded2'
  // HARDCODED_ROOT_NODE_ITEM_ID = 'item_373328df-e59d-4b90-99e1-7e3eee5f50ef'
  HARDCODED_ROOT_NODE_ITEM_ID = 'item_5026a2c6-948c-4875-8ff4-762ca845ae93'

  /* TODO: should be called *create*, because it is a completely new node/item involving db, vs addChild just looks like tree-only operation */
  abstract addChildNode(parentNode: OryTreeNode, newNode: OryTreeNode): void

  abstract addAssociateSiblingAfterNode(
    parentNode: OryTreeNode,
    nodeToAssociate: OryTreeNode,
    associateAfterNode: OryTreeNode
  ): void

  abstract loadNodesTree(listener: DbTreeListener): void

  abstract patchItemData(itemId: string, itemData: any): void

  abstract patchChildInclusionData(parentItemId: string, itemInclusionId: string, itemInclusionData: any, childItemId: string): void

  // abstract patchChildInclusionDataWithNewParent(nodeInclusionId: string, newParentNode: OryTreeNode): void

  abstract deleteWithoutConfirmation(itemId: string): void

}

