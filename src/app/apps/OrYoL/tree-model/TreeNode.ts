import {TreeNode} from 'primeng/api'
import {HasItemData} from './has-item-data'
import {TreeNodeInclusion$P} from './TreeNodeInclusion$P'
import {EventEmitter, Injector} from '@angular/core'
import {NodeInclusion} from './TreeListener'
import {RootTreeNode} from './RootTreeNode'
import {TreeModel} from './TreeModel'
import {TreeTableNodeContent} from './TreeTableNodeContent'
import {ItemId} from '../db/DbItem'
import {debugLog} from '../utils/log'
import {NodeOrderInfo} from './node-orderer'
import {sumRecursivelyIncludingRoot, sumRecursivelyJustChildren} from '../utils/collection-utils'

/** ======================================================================================= */
export class OryTreeNode<
  TData extends {
    title: string,
    isDone?: boolean,
  } = any,
  TNodeContent extends TreeTableNodeContent<TData> = TreeTableNodeContent<any>,
  /** lowest-common type of nodes (can include root) */
  TBaseNode extends OryTreeNode<any> = OryTreeNode<any>,
  TBaseNonRootNode extends TBaseNode = TBaseNode, /* maybe this should be right after TBaseNode */
  TSiblingNode extends TBaseNonRootNode = TBaseNonRootNode,
  TAncestorNode extends TBaseNode = TBaseNode,
  // TParentNode extends TAncestorNode & OryTreeNode<TBaseNode, TBaseNonRootNode, TBaseNode, TBaseNode, TAncestorNode> = TAncestorNode,
  TParentNode extends TAncestorNode = TAncestorNode,
  TChildNode extends TBaseNonRootNode = TBaseNonRootNode,
> extends RootTreeNode<
  TBaseNode,
  TBaseNonRootNode,
  TChildNode,
  TData,
  TNodeContent
>
{

  /** TODO this should not be present in RootNode class;
   * as well as: reorder, indent, outdent */
  nodeInclusion$ = new TreeNodeInclusion$P(
    this.injector,
    this.treeModel.treeService,
    this.nodeInclusion ! /* FIXME handle root */,
    this.itemId,
  )

  constructor(
    injector: Injector,
    content: TNodeContent,
    public nodeInclusion: NodeInclusion | undefined | null,
    itemId: ItemId,
    treeModel: TreeModel,
    itemData: TData | null,
    // public item$: TItem$,
  ) {
    super(injector, treeModel, itemId, itemData)
  }

  /** TODO: addSiblingOrChild (for enter press on root / visual root) */
  addSiblingAfterThis(newNode?: TBaseNonRootNode) {
    return this.parent2!.addChild(this, newNode)
  }

  reorderUp() {
    // TODO: if topmost, reorder to last item in this plan or to previous plan
    const siblingNodeAboveThis = this.getSiblingNodeAboveThis()
    const order = siblingNodeAboveThis ? {
      inclusionBefore:
      siblingNodeAboveThis?.getSiblingNodeAboveThis()?.nodeInclusion,
      inclusionAfter:
      siblingNodeAboveThis?.nodeInclusion
    } : { // wrap-around to last
      inclusionBefore: this.parent2!.lastChildNode ?. nodeInclusion,
      inclusionAfter: undefined
    }
    this.reorder(order)
  }

  reorderDown() {
    const siblingNodeBelowThis = this.getSiblingNodeBelowThis()
    const order = siblingNodeBelowThis ? {
      inclusionBefore:
      siblingNodeBelowThis?.nodeInclusion,
      inclusionAfter:
      siblingNodeBelowThis?.getSiblingNodeBelowThis()?.nodeInclusion
    } : { // wrap-around to first
      inclusionBefore: undefined,
      inclusionAfter: this.parent2!.children[0]!.nodeInclusion
    }
    this.reorder(order)
  }

  reorder(order: NodeOrderInfo) {
    debugLog('reorder order, this.parent2', order, this.parent2)
    // TODO: replace patch with set due to problems with "no document to update" after quickly reordering/indenting after creating
    const inclusion = this.nodeInclusion !
    this.treeModel.nodeOrderer.addOrderMetadataToInclusion(order, inclusion)

    { // reorder locally to avoid UI lag, e.g. when quickly reordering up/down and perhaps will remove keyboard appearing/disappearing on android
      this.parent2!._removeChild(this)
      const insertionIndex = this.parent2!.findInsertionIndexForNewInclusion(inclusion)
      this.parent2!._appendChildAndSetThisAsParent(this, insertionIndex)
      this.treeModel.treeListener.onAfterNodeMoved() // fixes focus being lost after reorder
      // TODO: duplicate with onNodeInclusionModified - extract applyParentAndOrder or smth
    }

    // TODO util func/obj to throttle smth e.g. incremental patch
    this.nodeInclusion$.patchThrottled(inclusion)
  }

  // ======================================================
  // TODO: extract classes like TaskNodeContent, DayPlanNodeContent
  // since nodes are to allow changing their type, we would just swap an instance of the class mentioned above
  // the separation first would be mainly to separate generic node-logic from time-planning specific, etc.

  indentDecrease() {
    if ( this.parent2?.isVisualRoot ) {
      debugLog(`cannot indentDecrease more - this node is child of visualRoot`, this)
      return
    }
    const newParent = this.parent2?.parent2
    if ( newParent ) {
      newParent.moveInclusionsHere([this], {beforeNode: this.parent2?.getSiblingNodeBelowThis()})
    }
  }

  indentIncrease() {
    const siblingNodeAboveThis = this.getSiblingNodeAboveThis()
    if ( siblingNodeAboveThis ) {
      siblingNodeAboveThis.moveInclusionsHere([this], {beforeNode: undefined})
    }
  }


}
