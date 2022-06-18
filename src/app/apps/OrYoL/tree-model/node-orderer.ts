import {
  debugLog,
  FIXME,
} from '../utils/log'
import { NodeInclusion } from './TreeListener'
import {defined, nullOrUndef} from '../../../libs/AppFedShared/utils/utils-from-oryol'


export const ORDER_STEP = 1 * 1000 * 1000

interface NodeInclusionWithOrderNum extends NodeInclusion {
  orderNum: number
}

export interface NodeOrderInfo {
  /* Note: naming: before&after is better than above&below because it is decoupled from spatial projection (imagine e.g. a graph in the future; or left-right flow of order) */
  inclusionBefore?: NodeInclusion,
  inclusionAfter?: NodeInclusion,
}

export class NodeOrderer {

  calculateNewOrderNumber(
    previousOrderNumber: number,
    nextOrderNumber: number,
  ): number {
    debugLog('calculateNewOrderNumber: ', previousOrderNumber, nextOrderNumber)
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

  addOrderMetadataToInclusion(
    order: NodeOrderInfo,
    inclusionToEnrich: NodeInclusion
  ) {
    const inclusionBefore = order.inclusionBefore as NodeInclusionWithOrderNum
    const inclusionAfter = order.inclusionAfter as NodeInclusionWithOrderNum
    const previousOrderNumber = inclusionBefore && inclusionBefore.orderNum

    // console.log('addChild: previousOrderNumber', previousOrderNumber)
    const nextOrderNumber = inclusionAfter && inclusionAfter.orderNum
    // console.log('addChild: nextOrderNumber', nextOrderNumber)
    const newOrderNumber = this.calculateNewOrderNumber(previousOrderNumber, nextOrderNumber);
    // console.log('addChild: newOrderNumber', newOrderNumber)
    (<NodeInclusionWithOrderNum> inclusionToEnrich).orderNum = newOrderNumber
  }

  findInsertionIndexForNewInclusion<TNode>(
    nodes: TNode[],
    newInclusion: NodeInclusion,
    accessInclusionFn: ((node: TNode) => NodeInclusion)
  ): number {
    const newOrderNum = (newInclusion as NodeInclusionWithOrderNum).orderNum

    let foundIndex = nodes.findIndex((node) => {
      const existingOrderNum = (accessInclusionFn(node) as NodeInclusionWithOrderNum).orderNum
      return existingOrderNum > newOrderNum
    })
    if ( foundIndex < 0 ) {
      // newIndex is higher than any existing
      foundIndex = nodes.length
    }
    return foundIndex
  }

}
