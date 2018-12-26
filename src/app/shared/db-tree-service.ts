import {OryTreeNode} from './TreeModel'
import {DbTreeListener} from './TreeListener'
import {defined, nullOrUndef} from './utils'
import { debugLog } from './log'


export abstract class DbTreeService {

  // HARDCODED_ROOT_NODE_ITEM_ID = 'KarolNodesHardcoded2'
  // HARDCODED_ROOT_NODE_ITEM_ID = 'item_373328df-e59d-4b90-99e1-7e3eee5f50ef'
  HARDCODED_ROOT_NODE_ITEM_ID = 'item_5026a2c6-948c-4875-8ff4-762ca845ae93'

  /* TODO: should be called *create*, because it is a completely new node/item involving db, vs addChild just looks like tree-only operation */
  abstract addChildNode(parentNode: OryTreeNode, newNode: OryTreeNode)

  abstract loadNodesTree(listener: DbTreeListener)

  abstract patchItemData(itemId: string, itemData: any)

  abstract patchChildInclusionData(itemId: string, itemInclusionId: string, itemInclusionData: any)

  abstract patchChildInclusionDataWithNewParent(nodeInclusionId: string, newParentNode: OryTreeNode, beforeNode: { beforeNode: OryTreeNode })

  abstract deleteWithoutConfirmation(itemId: string)

}

