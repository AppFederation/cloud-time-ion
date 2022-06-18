/**
 * Created by kd on 2017-10-28.
 */
import {
  ItemId,
  NodeInclusionId,
} from '../db/DbItem'

export class NodeInclusion {
  constructor(
    // public orderThisBeforeId,
    // public orderThisAfterId,
    public nodeInclusionId: NodeInclusionId,
    /** note other ordering implementations might not use orderNum */
    public orderNum?: number,
  ) {}
}

export class NodeAddEvent {
  constructor (
    public parents: any /* FIXME any */,
    public directParentItemId: ItemId,
    public itemData: any,
    public itemId: ItemId,
    public pendingListeners: number,
    public nodeInclusion: NodeInclusion
  ) {}
}

export abstract class DbTreeListener {
  abstract onNodeAddedOrModified(e: NodeAddEvent): void
  abstract onNodeInclusionModified(nodeInclusionId: string, nodeInclusionData: any, newParentItemId: string): void
}
