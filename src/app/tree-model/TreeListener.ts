/**
 * Created by kd on 2017-10-28.
 */

export class NodeInclusion {
  constructor(
    // public orderThisBeforeId,
    // public orderThisAfterId,
    public nodeInclusionId: string,
    /** note other ordering implementations might not use orderNum */
    public orderNum?: number,
  ) {}
}

export class NodeAddEvent {
  constructor (
    public parents,
    public immediateParentId: string,
    public itemData: any,
    public itemId: string,
    public pendingListeners: number,
    public nodeInclusion: NodeInclusion
  ) {}
}

export abstract class DbTreeListener {
  abstract onNodeAddedOrModified(e: NodeAddEvent)
  abstract onNodeInclusionModified(nodeInclusionId: string, nodeInclusionData, newParentItemId: string)
}
