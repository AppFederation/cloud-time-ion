import {NodeAddEvent, NodeInclusion} from './TreeListener'
import {debugLog, errorAlert, FIXME, traceLog} from '../utils/log'
import {DbTreeService} from './db-tree-service'
import {EventEmitter, Injectable, Injector} from '@angular/core'
import {OryColumn} from '../tree-shared/OryColumn'
import {MultiMap} from '../utils/multi-map'
import {NodeOrderer, NodeOrderInfo} from './node-orderer'
import {PermissionsManager} from './PermissionsManager'
import {DbItem, ItemId, NodeInclusionId} from '../db/DbItem'
import {sumRecursivelyIncludingRoot, sumRecursivelyJustChildren} from '../utils/collection-utils'
import {DataItemsService} from '../core/data-items.service'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {TreeNode} from 'primeng/api'
import {nullOrUndef, uuidv4} from '../../../libs/AppFedShared/utils/utils-from-oryol'
import {getLastItemOrUndefined} from '../../../libs/AppFedShared/utils/arrayUtils'
import {isNullish} from '../../../libs/AppFedShared/utils/utils'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {AuthService} from '../../../auth/auth.service'
import {TreeTableNodeContent} from './TreeTableNodeContent'
import {OryTreeTableNodeContent} from './OryTreeTableNodeContent'
import {TreeNodeInclusion$P} from './TreeNodeInclusion$P'
// import {TreeTableNode} from './TreeTableNode'

/**
 * Created by kd on 2017-10-27.
 *
 * NOTE: this file has both TreeModel and TreeNode to avoid a warning about circular dependency between files.
 * Maybe I will find a better way, perhaps involving refactor...
 */


/** ======================================================================================= */
/** TODO: this should be delegated to database as it might have its own conventions/implementation (e.g. firebase push id) */
export const generateNewInclusionId = function () {
  return 'inclusion_' + uuidv4()
}


/** ======================================================================================= */

export abstract class OryTreeListener {
  abstract onAfterNodeMoved(): void
}

export class RootTreeNode<
  TNodeContent extends TreeTableNodeContent = TreeTableNodeContent,
  /** lowest-common type of nodes (can include root) */
  TBaseNode extends RootTreeNode<TNodeContent> = RootTreeNode<TNodeContent, any>,// OryTreeNode = OryTreeNode<any>,
  TBaseNonRootNode extends TBaseNode & ApfNonRootTreeNode<TNodeContent, TBaseNode> = TBaseNode & ApfNonRootTreeNode<TNodeContent, TBaseNode, any>, /* maybe this should be right after TBaseNode */
  // TParentNode extends TAncestorNode & OryTreeNode<TBaseNode, TBaseNonRootNode, TBaseNode, TBaseNode, TAncestorNode> = TAncestorNode,
  TChildNode extends TBaseNonRootNode & TBaseNode = TBaseNonRootNode & TBaseNode,
>

  implements TreeNode // , HasItemData
{
  // ==== from PrimeNG's TreeNode:

  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  children: TBaseNonRootNode/*TChildNode*/[] = [];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: TreeNode;
  /** because `parent` is reset to null by the tree component if the node is top-level.
   * Possibly rename to parentEvenIfRoot or parentEvenIfTopLevel */
  parent2?: TBaseNode//TParentNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;

  // ==== End of PrimeNG's TreeNode

  /** TODO: rename to itemData$ and use CachedSubject to get initial val too;
   * TODO: unify with DbItem.data$ */
  onChangeItemData = new EventEmitter()
  onChangeItemDataOfChild = new EventEmitter()

  static INITIAL_TITLE = ''


  get title() {
    return this.content.itemData?.title
  }

  constructor(
    public injector: Injector,
    public treeModel: TreeModel<TNodeContent, TBaseNode, TBaseNode>,
    public itemId: ItemId,
    public content: TNodeContent,
  ) {
  }

  getId() {
    return this.itemId
  }

  fireOnChangeItemDataOfChildOnParents() {
    debugLog('fireOnChangeItemDataOfChildOnParents')
    for (let parent of this.getParentsPathArray()) {
      parent.onChangeItemDataOfChild.emit()
    }
  }

  navigateInto() {
    this.treeModel.navigation.navigateInto(this)
  }

  findInsertionIndexForNewInclusion(newInclusion: NodeInclusion): number {
    return this.treeModel.nodeOrderer.findInsertionIndexForNewInclusion<TBaseNonRootNode/*TChildNode*/>(
      this.children,
      newInclusion,
      (node: TBaseNonRootNode/*TChildNode*/) => {
        return node.nodeInclusion !
      },
    )
  }


  public get hasChildren() {
    return this.numChildren > 0
  }

  public get numChildren() {
    return this.children?.length ?? 0
  }

  expansion: any /* FIXME */ = new class Expansion {
    constructor(
      public treeNode: RootTreeNode<any, any, any, any>,
    ) {
    }

    setExpansionOnParentsRecursively(expandToSet: boolean) {
      this.treeNode.getAncestorsPathArray().forEach(node => {
        node.expanded = expandToSet
      })
    }

    areParentsExpandedToMakeThisNodeVisible(): boolean {
      let ret: boolean
      if (this.treeNode.isRoot) {
        ret = this.treeNode.treeModel.isRootShown
      } else {
        const ancestorsPathArrayExcludingVirtualRoot = this.treeNode.getAncestorsPathArrayExcludingVirtualRoot()
        // console.log(`ancestorsPathArrayExcludingVirtualRoot for node [${this.treeNode.itemData?.title}]`,
        //   ancestorsPathArrayExcludingVirtualRoot.map(node => `> ${node.title}`))
        ret = ancestorsPathArrayExcludingVirtualRoot.every(node => {
          return node.expanded
        })
      }
      // console.log('areParentsExpandedToMakeThisNodeVisible ret', ret, this.treeNode.itemData?.title)
      return ret
      // return false
    }

    setExpanded(expansionState: boolean, recursive: boolean | { recursive: boolean }) {
      const recursiveAsOptions = (recursive as { recursive: boolean })
      if (recursiveAsOptions && !isNullish(recursiveAsOptions.recursive)) {
        recursive = recursiveAsOptions.recursive
      }

      this.treeNode.expanded = expansionState
      if (recursive) {
        this.treeNode.children.forEach((node: TChildNode) => {
          node.expansion.setExpanded(expansionState, recursive);
        });
      }
    }

    toggleExpansion(recursive: boolean) {
      this.setExpanded(!this.treeNode.expanded, recursive)
    }

  }(this)

  _removeChild(nodeToRemove: TChildNode) {
    this.children = this.children.filter(node => node !== nodeToRemove)
  }

  get isRoot(): boolean {
    return this.treeModel.root === this as any as TBaseNode
  }

  get isVisualRoot(): boolean {
    return this === this.treeModel.navigation.visualRoot
  }

  get lastChildNode(): TBaseNonRootNode/*TChildNode*/ | undefined {
    return this.getChildAtIndexOrUndefined(this.children?.length - 1)
  }

  get isChildOfRoot() {
    return !(this.parent2?.parent2) // top-level node (our parent is the virtual root)
  }

  highlight: any /* FIXME */ = new class Highlight {
    constructor(public treeNode: RootTreeNode) {
    }

    isChildOfFocusedNode() {

    }

    isAncestorOfFocusedNode(): boolean {
      return !!(
        this.treeNode.treeModel.focus.lastFocusedNode?.getParentsPathArray().some((ancestorOfFocused) => {
          return this.treeNode === ancestorOfFocused
        })
      )
    }
  }(this)

  getParentsPathArray(): TBaseNode[] {
    let ret: TBaseNode[] = []
    let node: TBaseNode | undefined = this.parent2
    while (true) {
      if (!node) {
        // debugLog('getAncestorsPathArray', ret)
        ret = ret.reverse()
        // debugLog(`getParentsPathArray for node [${this.itemData?.title}]`, ret.map(node => `> ${node.itemData?.title}`))

        return ret
      } else {
        ret.push(node)
        node = node.parent2 as TBaseNode
      }
    }
  }

  getAncestorsPathArray() {
    const pathArray = this.getParentsPathArray()
    // return pathArray.slice(0, pathArray.length - 1 /*exclusive - skip last*/)
    return pathArray.slice(0, pathArray.length - 0 /* not skipping last */)
  }

  getAncestorsPathArrayExcludingVirtualRoot() {
    const ancestorsPathArray = this.getAncestorsPathArray()
    return ancestorsPathArray.slice(1, ancestorsPathArray.length)
  }

  /** consider wrap-around */
  getNodeVisuallyBelowThis(): TBaseNode | undefined {
    // this could be extracted as a generic tree util func, a'la sumRecursively
    let ret: TBaseNode | undefined
    const simple = (
      // this.children
      // && this.children.length
      // && this.children[0]
      this.children?.[0]
      || this.getSiblingNodeBelowThis()
      // ||
    )
    if (simple) {
      ret = simple
    } else {
      let parent: TBaseNode | undefined = this.parent2
      while (parent && !parent.isVisualRoot) {
        if (parent.getSiblingNodeBelowThis()) {
          ret = parent.getSiblingNodeBelowThis() as any as TBaseNode
          break
        }
        parent = parent.parent2 as TBaseNode
      }
    }
    debugLog(`getNodeVisuallyBelowThis(): not found - wrap around to top-most`)
    debugLog(`getNodeVisuallyBelowThis(): this.treeModel.navigation.visualRoot`, this.treeModel.navigation.visualRoot)
    ret = ret || this.treeModel.navigation.visualRoot // .children[0]
    if (!ret?.expansion.areParentsExpandedToMakeThisNodeVisible()) {
      ret = ret?.getNodeVisuallyBelowThis() as TBaseNode // recursive call
    }
    debugLog(`getNodeVisuallyBelowThis() ret`, ret)
    return ret
  }

  /** can also return this node */
  getLastMostNestedVisibleNodeRecursively(): TBaseNode /* actually `this`, but `this` does not work like that */ | TChildNode | undefined {
    const lastDirectChild = this.getLastDirectChild()
    if (lastDirectChild && !lastDirectChild.expansion.areParentsExpandedToMakeThisNodeVisible()) {
      return this as any as TBaseNode // we stop at this because deeper one is not visible
    }
    if (lastDirectChild) {
      return lastDirectChild.getLastMostNestedVisibleNodeRecursively() as TChildNode
    } else {
      return this as any as TBaseNode // workaround
    }
  }

  public getLastDirectChild(): TBaseNonRootNode/*TChildNode*/ | undefined {
    return getLastItemOrUndefined(this.children)
  }

  _appendChildAndSetThisAsParent(nodeToAppend: TBaseNonRootNode/*TChildNode*/, insertBeforeIndex?: number) {
    // TODO: consider reacting to multi-node changes here for all nodes with the same
    // nodeToAppend ??= this.createChildNode()
    const afterNode = this.lastChildNode

    if (nullOrUndef(insertBeforeIndex)) {
      insertBeforeIndex = this.children.length
    }
    if (nullOrUndef(this.children)) {
      this.children = []
    }
    nodeToAppend.parent = this
    nodeToAppend.parent2 = this as any as TBaseNode

    // add node to other nodes of the same itemId:
    for (const node of this.treeModel.getNodesByItemId(this.itemId)) {
      this.children.splice(insertBeforeIndex!, 0, nodeToAppend)
      this.treeModel.registerNode(nodeToAppend)
    }
    return nodeToAppend
  }

  protected newItemData() {
    return {title: ApfNonRootTreeNode.INITIAL_TITLE}
  }

  getChildAtIndexOrUndefined(index: number): TBaseNonRootNode/*TChildNode*/ | undefined {
    if (this.isIndexPresent(index)) {
      return this.children[index]
    } else {
      return undefined
    }
  }

  /** TODO: rename isItemIndexPresent */
  private isIndexPresent(index: number): boolean {
    const lastIndex = this.children.length - 1
    return !(index < 0 || index > lastIndex);
  }

  /* TODO: should be called *create*, because it is a completely new node/item involving db, vs addChild just looks like tree-only operation */
  addChild(afterExistingNode?: TBaseNonRootNode/*TChildNode*/, newNode?: TBaseNonRootNode/*TChildNode*/): TBaseNonRootNode/*TChildNode*/ {
    if (!afterExistingNode && this.children.length > 0) {
      afterExistingNode = this.lastChildNode
    }

    // console.log('addChild, afterExistingNode', afterExistingNode)

    const nodeBelow = afterExistingNode?.getSiblingNodeBelowThis()
    // console.log('addChild: nodeBelow', nodeBelow)
    const nodeInclusion: NodeInclusion = newNode?.nodeInclusion || new NodeInclusion(generateNewInclusionId(), /*parentItemId: */ this.itemId
      /* FIXME order is added in addOrderMetadataToInclusion */)

    this.treeModel.nodeOrderer.addOrderMetadataToInclusion(
      {
        inclusionBefore: afterExistingNode?.nodeInclusion,
        inclusionAfter: nodeBelow?.nodeInclusion,
      },
      nodeInclusion,
    )
    const itemData = this.newItemData()
    const newItemId = this.generateItemId()
    const nodeContent = this.createNodeContent(newItemId, itemData)
    newNode = newNode ?? this.createChildNode(nodeInclusion, nodeContent)

    // newNode.nodeInclusion = nodeInclusion

    this.treeModel.permissionsManager.onAfterCreated(newNode as any as OryBaseTreeNode)

    this.treeModel.treeService.addChildNode(this as any as OryBaseTreeNode, newNode as any as OryBaseTreeNode)

    const newNodeIndex = afterExistingNode ? (afterExistingNode.getIndexInParent() + 1) : 0
    this._appendChildAndSetThisAsParent(newNode, newNodeIndex) // this is to avoid delay caused by Firestore; for UX
    // TODO: handle adding child in multiple parents; and this addChild method should actually accept DbItem instead of node, coz it really might create multiple nodes
    return newNode
  }

  public createNodeContent(newItemId: string, itemData: { title: string }): TNodeContent {
    return new TreeTableNodeContent(this.injector, newItemId, itemData) as any as TNodeContent
  }

  /** FIXME should be protected */
  public createChildNode(nodeInclusion: NodeInclusion, content: TNodeContent): TChildNode {
    const newNode = new ApfNonRootTreeNode(this.injector, content, nodeInclusion, content.getId(), this.treeModel as TreeModel<any>)
    content.setTreeNodeAndInit(newNode)
    return newNode as any as TChildNode
    // new TreeTableNode(newInclusion, nodeToAssociate.itemId, this.treeModel, nodeToAssociate.itemData) as TChildNode
  }

  protected generateItemId() {
    return 'item_' + uuidv4()
  }

  addAssociationsHere(nodes: TBaseNonRootNode/*TChildNode*/[], beforeNode: TBaseNonRootNode/*TChildNode*/ | undefined) {
    // FIXME: use beforeNode
    FIXME('addAssociationsHere not impl')
    for (const nodeToAssociate of nodes) {
      const newInclusion = new NodeInclusion(/* FIXME handle order */generateNewInclusionId(), this.itemId)
      this.treeModel.nodeOrderer.addOrderMetadataToInclusion(
        {
          inclusionBefore: this.lastChildNode?.nodeInclusion,
          inclusionAfter: undefined,
        },
        newInclusion,
      )

      const newNode = this.createChildNode(newInclusion, nodeToAssociate.content as TNodeContent)
      this.treeModel.treeService.addAssociateSiblingAfterNode(
        this as any as OryBaseTreeNode,
        newNode as any as OryBaseTreeNode,
        this.lastChildNode as any as OryBaseTreeNode,
      )
    }
  }

  /* This could/should probably be unified with reorder code */
  moveInclusionsHere(nodes: TBaseNonRootNode[], beforeNode: { beforeNode: TBaseNonRootNode/*TChildNode*/ | undefined }) {
    // FIXME('moveInclusionsHere: need to calculate order numbers to be last children')
    for (const childNodeToAssociate of nodes) {
      const nodeAfter = beforeNode?.beforeNode
      let nodeBefore = nodeAfter?.getSiblingNodeAboveThis()
      if (!nodeAfter && !nodeBefore) {
        // both nodeAfter and nodeBefore can become falsy, causing order == 0
        nodeBefore = this.lastChildNode
      }
      const inclusionToModify = childNodeToAssociate.nodeInclusion !
      inclusionToModify.parentItemId = this.itemId
      this.treeModel.nodeOrderer.addOrderMetadataToInclusion(
        {
          inclusionBefore: nodeBefore?.nodeInclusion,
          inclusionAfter: nodeAfter?.nodeInclusion,
        },
        inclusionToModify,
      )
      this.patchChildInclusionData(inclusionToModify, childNodeToAssociate)
      childNodeToAssociate.parent2!._removeChild(childNodeToAssociate)
      const insertionIndex = nodeAfter ? nodeAfter.getIndexInParent() : this.children.length
      this._appendChildAndSetThisAsParent(childNodeToAssociate, insertionIndex)
    }
  }

  private patchChildInclusionData(inclusionToModify: NodeInclusion, childNodeToAssociate: TBaseNonRootNode/*TChildNode*/) {
    // this.treeModel.treeService.patchChildInclusionData(
    //   /*nodeToAssociate.itemId*/ this.itemId /* parent*/,
    //   inclusionToModify.nodeInclusionId,
    //   inclusionToModify,
    //   childNodeToAssociate.itemId,
    // )
    childNodeToAssociate.nodeInclusion$.patchThrottled(inclusionToModify)
  }

  deleteWithoutConfirmation() {
    this.treeModel.treeService.deleteWithoutConfirmation(this.itemId)
    this.parent2!._removeChild(this as any as TBaseNonRootNode)
  }

  public getSumRecursivelyJustChildren(sumValueFunc: any): number {
    return sumRecursivelyJustChildren<TBaseNode, TChildNode>(
      this as any as TBaseNode,
      node => node.children as TChildNode[], sumValueFunc)
  }

  public getSumRecursivelyIncludingThisNode(sumValueFunc: any): number {
    return sumRecursivelyIncludingRoot<TBaseNode, TChildNode>(
      this as any as TBaseNode,
      node => node.children as TChildNode[], sumValueFunc)
  }

  public getIndexInParent(): number {
    return this.parent2?.children?.indexOf(this as any as TBaseNonRootNode) ?? 0
  }

  getSiblingNodeAboveThis(): TBaseNonRootNode | undefined {
    const index = this.getIndexInParent()
    return this.parent2?.getChildAtIndexOrUndefined(index - 1) as TBaseNonRootNode | undefined
  }

  getSiblingNodeBelowThis(): TBaseNonRootNode | undefined {
    const index = this.getIndexInParent()
    // console.log('getNodeBelow index', index, 'count', this.parent2.children.length)
    const childAtIndexOrNull = this.parent2?.getChildAtIndexOrUndefined(index + 1)
    // debugLog('getNodeBelow childAtIndexOrNull', childAtIndexOrNull)
    return childAtIndexOrNull as any as TBaseNonRootNode | undefined
  }

  getNodeVisuallyAboveThis(): TBaseNode | undefined {
    // debugLog(`getNodeVisuallyAboveThis this.isVisualRoot`, this.isVisualRoot)
    if (this.isVisualRoot) {
      return this.treeModel.navigation.visualRoot.getLastMostNestedVisibleNodeRecursively()
    }
    let ret: TBaseNode | undefined
    const siblingNodeAboveThis: TBaseNode | undefined = this.getSiblingNodeAboveThis()
    if (siblingNodeAboveThis) {
      const lastMostNestedNodeRecursively = siblingNodeAboveThis.getLastMostNestedVisibleNodeRecursively()
      ret = lastMostNestedNodeRecursively as TBaseNode
    } else {
      ret = siblingNodeAboveThis ||
        this.parent2 || /* note this IS parent2 - should go to the root of all (if it is shown...) */
        this.treeModel.root.getLastMostNestedVisibleNodeRecursively() as TBaseNode | undefined // not found -- wrap around to bottom-most
    }
    if (ret!.expansion.areParentsExpandedToMakeThisNodeVisible()
      /* TODO: might need smth like && isVisible to handle the isRootVisible case. Later also think about filtering */
    ) {
      // debugLog('getNodeVisuallyAboveThis 1')
      return ret
    } else {
      // debugLog('getNodeVisuallyAboveThis 2')
      // recursive call:
      return ret?.getNodeVisuallyAboveThis() as TBaseNode | undefined // skip this one, as it is not visible via being collapsed
    }
  }

}


export type ApfBaseTreeNode = RootTreeNode<any>

/** ======================================================================================= */
export class ApfNonRootTreeNode<
  TNodeContent extends TreeTableNodeContent = TreeTableNodeContent,
  /** lowest-common type of nodes (can include root) */
  TBaseNode extends RootTreeNode<TNodeContent> = RootTreeNode<TNodeContent>,
  TBaseNonRootNode extends TBaseNode & ApfNonRootTreeNode<TNodeContent, TBaseNode> = TBaseNode & ApfNonRootTreeNode<TNodeContent, TBaseNode, any>, /* maybe this should be right after TBaseNode */
  TSiblingNode extends TBaseNonRootNode = TBaseNonRootNode,
  TAncestorNode extends TBaseNode = TBaseNode,
  // TParentNode extends TAncestorNode & OryTreeNode<TBaseNode, TBaseNonRootNode, TBaseNode, TBaseNode, TAncestorNode> = TAncestorNode,
  TParentNode extends TAncestorNode = TAncestorNode,
  TChildNode extends TBaseNonRootNode = TBaseNonRootNode,
> extends RootTreeNode<
  TNodeContent,
  TBaseNode,
  TBaseNonRootNode,
  TChildNode
> {

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
    treeModel: TreeModel<TNodeContent, TBaseNode, any, TBaseNonRootNode>,
    // itemData: TData | null,
    // public item$: TItem$,
  ) {
    super(injector, treeModel, itemId, content)
  }

  /** TODO: addSiblingOrChild (for enter press on root / visual root) */
  addSiblingAfterThis(newNode?: TBaseNonRootNode): TBaseNonRootNode {
    return this.parent2!.addChild(this, newNode) as TBaseNonRootNode
  }

  reorderUp() {
    // TODO: if topmost, reorder to last item in this plan or to previous plan
    const siblingNodeAboveThis = this.getSiblingNodeAboveThis()
    const order = siblingNodeAboveThis ? {
      inclusionBefore:
      siblingNodeAboveThis?.getSiblingNodeAboveThis()?.nodeInclusion,
      inclusionAfter:
      siblingNodeAboveThis?.nodeInclusion,
    } : { // wrap-around to last
      inclusionBefore: this.parent2!.lastChildNode?.nodeInclusion,
      inclusionAfter: undefined,
    }
    this.reorder(order)
  }

  reorderDown() {
    const siblingNodeBelowThis = this.getSiblingNodeBelowThis()
    const order = siblingNodeBelowThis ? {
      inclusionBefore:
      siblingNodeBelowThis?.nodeInclusion,
      inclusionAfter:
      siblingNodeBelowThis?.getSiblingNodeBelowThis()?.nodeInclusion,
    } : { // wrap-around to first
      inclusionBefore: undefined,
      inclusionAfter: this.parent2!.children[0]!.nodeInclusion,
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
    if (this.parent2?.isVisualRoot) {
      debugLog(`cannot indentDecrease more - this node is child of visualRoot`, this)
      return
    }
    const newParent = this.parent2?.parent2
    if (newParent) {
      newParent.moveInclusionsHere([this], {beforeNode: this.parent2?.getSiblingNodeBelowThis()})
    }
  }

  indentIncrease() {
    const siblingNodeAboveThis = this.getSiblingNodeAboveThis()
    if (siblingNodeAboveThis) {
      siblingNodeAboveThis.moveInclusionsHere([this], {beforeNode: undefined})
    }
  }


}

export type OryBaseTreeNode = RootTreeNode<OryTreeTableNodeContent, ApfNonRootTreeNode<OryTreeTableNodeContent>, OryNonRootTreeNode, OryNonRootTreeNode>
export type OryNonRootTreeNode = ApfNonRootTreeNode<OryTreeTableNodeContent, ApfNonRootTreeNode<OryTreeTableNodeContent>>


/** rename to TreeTableCell, as this deals with columns already */
export class TreeCell {
  constructor(
    public node?: ApfBaseTreeNode,
    public column?: OryColumn,
  ) {}
}

export class FocusEvent {
  constructor(
    public cell: TreeCell,
    public options?: NodeFocusOptions,
  ) {}
}

export class NodeFocusOptions {
  cursorPosition?: number
}


/** =========================================================================== */
/** =========================================================================== */
/** ===========================================================================
 * Idea: have a class that would contain all other classes, e.g. Focus and
 * extract content-specific (what is currently TreeModel),
 * to TreeContents or TreeNodes class for better separation of concerns
 */
@Injectable()
export class TreeModel<
  TNodeContent extends TreeTableNodeContent<any>,
  TBaseNode extends RootTreeNode<any> = RootTreeNode<any>,
  TRootNode extends TBaseNode = TBaseNode,
  TNonRootNode extends TBaseNode & ApfNonRootTreeNode<TNodeContent> = TBaseNode & ApfNonRootTreeNode<TNodeContent>,
>
{

  nodeOrderer = new NodeOrderer()

  /** hardcoded for now, as showing real root-most root is not implemented in UI due to issues */
  isRootShown = false

  navigation: any = new class Navigation {
    visualRoot: TBaseNode | null | undefined = null
    visualRoot$ = new CachedSubject<TBaseNode>()

    constructor(public treeModel: TreeModel<any>) {
    }

    navigateInto(node: TBaseNode | string | undefined){
      if ( !node  ) {
        return
      }
      if ( this.visualRoot === node ) {
        return // Prevent navigation if currently navigated-to (visual root) node is the same
      }
      if ( typeof node === 'string' ) {
        node = this.treeModel.getNodesByItemId(node)[0] as TBaseNode
        if ( ! node ) {
          errorAlert('navigateInto: unable to find node with id ', node)
          return
        }
      }
      this.visualRoot = node as TBaseNode
      this.treeModel.isRootShown = node !== this.treeModel.root
      ;(node as TBaseNode).expanded = true
      // this.treeModel.focus.lastFocusedCell.node.
      // this.treeModel.focus.setFocused(node, )
      // TODO: set focused
      // console.log('this.visualRoot$.next(this.visualRoot!)', this.visualRoot)
      this.visualRoot$.next(this.visualRoot!)
    }

    navigateToParent() {
      const node = this.visualRoot?.parent2 as TBaseNode
      this.navigateInto(node)
    }

    navigateToRoot() {
      this.navigateInto(this.treeModel.root as TBaseNode)
    }

  }(this)

  mapNodeInclusionIdToNodes = new MultiMap<NodeInclusionId, TNonRootNode>()

  mapItemIdToNodes = new MultiMap<ItemId, TBaseNode>()

  private mapItemById = new Map<ItemId, DbItem>()

  isApplyingFromDbNow = false

  focus = new class Focus {

    /** could skip the "focused" part */
    lastFocusedNode: TBaseNode | undefined
    /** could skip the "focused" part */
    lastFocusedColumn: OryColumn | undefined

    // expectedNewNodeToFocus:  = null

    focus$ = new EventEmitter<FocusEvent>()

    get lastFocusedCell() {
      return new TreeCell(this.lastFocusedNode, this.lastFocusedColumn)
    }

    ensureNodeVisibleAndFocusIt(treeNode?: TBaseNode | nullish, column?: OryColumn | nullish, options?: NodeFocusOptions) {
      this.lastFocusedNode = treeNode ?? undefined
      this.lastFocusedColumn = column ?? undefined
      treeNode?.expansion?.setExpansionOnParentsRecursively(true)
      this.focus$.emit(new FocusEvent(this.lastFocusedCell, options))
    }
  }

  /** Workaround for now, as there were some non-deleted children of a deleted parent */
  public showDeleted: boolean = false

  permissionsManager: PermissionsManager

  dataItemsService = this.injector.get(DataItemsService)

  /** Init last, because OryTreeNode depends on stuff from TreeModel */
  root: TRootNode = new RootTreeNode(this.injector, this, this.treeService.HARDCODED_ROOT_NODE_ITEM_ID,
    new TreeTableNodeContent<any, TBaseNode>(this.injector, this.treeService.HARDCODED_ROOT_NODE_ITEM_ID, {title: ''} as any

    ) as any as TNodeContent
  ) as any as TRootNode

  constructor(
    public injector: Injector,
    /* TODO Rename to dbTreeService */
    public treeService: DbTreeService,
    public authService: AuthService,
    public treeListener: OryTreeListener,
  ) {
    this.root.content.setTreeNodeAndInit(this.root)
    this.addNodeToMapByItemId(this.root)
    this.permissionsManager = new PermissionsManager(this.authService.userId!)
    this.navigation.navigateToRoot()
  }

  /* TODO: unify onNodeAdded, onNodeInclusionModified; from OryTreeNode: moveInclusionsHere, addAssociationsHere, addChild, _appendChildAndSetThisAsParent,
   * reorder(). In general unify reordering with moving/copying inclusions and adding nodes */

  obtainItemById(itemId: ItemId): DbItem {
    let item = this.mapItemById.get(itemId)
    if ( ! item ) {
      item = new DbItem(itemId)
      this.mapItemById.set(itemId, item)
    }
    return item
  }

  onNodeAdded(event: NodeAddEvent) {
    debugLog('onNodeAdded NodeAddEvent', event)
    const nodeInclusionId = event.nodeInclusion.nodeInclusionId
    const existingNodes = this.mapNodeInclusionIdToNodes.get(nodeInclusionId)
    try {
      this.isApplyingFromDbNow = true
      if ( existingNodes ?. length > 0 ) {
        traceLog('node(s) for inclusion already exist(s): ', nodeInclusionId)
        for ( const existingNode of existingNodes ) {
          // setTimeout(() => {
          //   setTimeout(() => {
          // setTimeout to avoid "ExpressionChangedAfterItHasBeenCheckedError" in NodeContentComponent.html
          existingNode.content.itemData = event.itemData
          traceLog('existingNode.onChangeItemData.emit(event.itemData)', existingNode, existingNode.content.itemData)

          existingNode.onChangeItemData.emit(event.itemData)
          existingNode.fireOnChangeItemDataOfChildOnParents()
          // TODO: unify with the else branch and emit onChangeItemData* stars there too
          // })
          // }, 0)
        }
      } else {
        // node with inclusion does not yet exist
        if ( ! event.itemData.deleted || this.showDeleted ) {
          const parentNodes = this.mapItemIdToNodes.get(event.directParentItemId)
          traceLog('onNodeAdded parentNodes', parentNodes)
          if ( ! parentNodes ) {
            console.log('onNodeAdded: no parent', event.directParentItemId)
          } else {
            for (const parentNode of parentNodes) {
              // TODO prolly move this into tree node class
              let insertBeforeIndex = parentNode.findInsertionIndexForNewInclusion(event.nodeInclusion)

              const newTreeNode: TNonRootNode = parentNode.createChildNode(event.nodeInclusion,
                parentNode.createNodeContent(event.itemId, event.itemData)
                ) as any as TNonRootNode
              parentNode._appendChildAndSetThisAsParent(newTreeNode as any, insertBeforeIndex)
              this.dataItemsService.onItemWithDataAdded$.next(newTreeNode.content) //newTreeNode as any as TreeTableNode /* HACK */)
              // console.log('onItemWithDataAdded$.next(newTreeNode)')
            }
          }
        }
      }
    } finally {
      this.isApplyingFromDbNow = false
    }
  }

  // protected createTreeNode(nodeInclusion: NodeInclusion, itemId: ItemId, itemData: TItemData): TNonRootNode {
  //   return new OryTreeNode(this.injector, nodeInclusion, itemId, this, itemData as any) as TNonRootNode
  // }

  /* Can unify this with moveInclusionsHere() */
  onNodeInclusionModified(nodeInclusionId: NodeInclusionId, nodeInclusionData: any, newParentItemId: ItemId) {
    // TODO: ensure this same code is executed locally immediately after reorder/move, without waiting for DB
    // if ( nodeInclusionData.parentNode)
    const nodes: TNonRootNode[] | undefined = this.mapNodeInclusionIdToNodes.get(nodeInclusionId)
    for (const node of nodes) {
      // if ( node.parent2.itemId !== newParentItemId ) {
      // change parent
      node.parent2!._removeChild(node)
      const newParents = this.mapItemIdToNodes.get(newParentItemId)
      // FIXME: need to create new node instead of moving existing
      debugLog('onNodeInclusionModified newParents.length', newParents.length)
      if ( newParents && newParents.length > 1 ) {
        debugLog('FIXME: onNodeInclusionModified moving node and there are multiple new parents - not yet impl.! newParents', newParents, 'length', newParents.length)
        window.alert('FIXME: onNodeInclusionModified moving node and there are multiple new parents - not yet impl.!')
      }
      for ( const newParent of newParents ) {
        const insertionIndex = newParent.findInsertionIndexForNewInclusion(nodeInclusionData)

        newParent._appendChildAndSetThisAsParent(node as any/* as TNonRootNode*/, insertionIndex)
      }
      node.nodeInclusion = nodeInclusionData
    }

    // } else { /* same parent */
    //   node.nodeInclusion = nodeInclusionData
    //   const insertionIndex = node.parent2.findInsertionIndexForNewInclusion(node.nodeInclusion)
    //   node.parent2.children.splice(insertionIndex, 0, node)
    //   // node.parent2.children = sortBy(node.parent2.children, item => item.nodeInclusion.orderNum)
      this.treeListener.onAfterNodeMoved()
    // }
  }

  registerNode(nodeToRegister: TNonRootNode) {
    this.mapNodeInclusionIdToNodes.add(nodeToRegister.nodeInclusion!.nodeInclusionId, nodeToRegister)
    this.addNodeToMapByItemId(nodeToRegister)
  }

  private addNodeToMapByItemId(nodeToRegister: TBaseNode) {
    this.mapItemIdToNodes.add(nodeToRegister.itemId, nodeToRegister)
  }

  getNodesByItemId(itemId: ItemId): TBaseNode[] {
    const nodes: TBaseNode[] = this.mapItemIdToNodes.get(itemId)
    return nodes
  }

}
