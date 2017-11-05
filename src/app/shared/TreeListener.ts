/**
 * Created by kd on 2017-10-28.
 */

export class NodeInclusion {
  constructor(
    public orderThisBeforeId,
    public orderThisAfterId,
    public orderNum: number,
    public nodeInclusionId: string,
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
