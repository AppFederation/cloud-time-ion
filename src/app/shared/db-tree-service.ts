import {OryTreeNode} from './TreeModel'
import {DbTreeListener} from './TreeListener'
import {defined, nullOrUndef} from './utils'

export const ORDER_STEP = 1 * 1000 * 1000


export abstract class DbTreeService {

  HARDCODED_ROOT_NODE_ITEM_ID = 'KarolNodesHardcoded2'

  abstract addSiblingAfterNode(parentNode: OryTreeNode, newNode: OryTreeNode, afterExistingNode: OryTreeNode, previousOrderNumber, newOrderNumber, nextOrderNumber)

  abstract loadNodesTree(listener: DbTreeListener)

  abstract patchItemData(itemId: string, itemData: any)

  abstract patchChildInclusionData(itemId: string, itemInclusionId: string, itemInclusionData: any)


  static calculateNewOrderNumber(
      previousOrderNumber: number,
      nextOrderNumber: number,
      ) {
    console.log('calculateNewOrderNumber: ', previousOrderNumber, nextOrderNumber)
    let newOrderNumber
    if (nullOrUndef(previousOrderNumber) && defined(nextOrderNumber)) {
      newOrderNumber = nextOrderNumber - ORDER_STEP
    } else if (defined(previousOrderNumber) && nullOrUndef(nextOrderNumber)) {
      newOrderNumber = previousOrderNumber + ORDER_STEP
    } else if (nullOrUndef(previousOrderNumber) && nullOrUndef(nextOrderNumber)) {
      newOrderNumber = 0
    } else { /* both next and previous is defined */
      newOrderNumber = ( previousOrderNumber + nextOrderNumber ) / 2;
    }

    if (nextOrderNumber === newOrderNumber || previousOrderNumber === newOrderNumber) {
      window.alert(`Order number equal: new:${newOrderNumber},previous:${previousOrderNumber},next:${nextOrderNumber}`)
    }
    return newOrderNumber
  }

  abstract delete(itemId: string)
}

