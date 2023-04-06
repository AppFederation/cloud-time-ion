import {
  NodeAddEvent,
  NodeInclusion,
} from './TreeListener'
import {
  debugLog, errorAlert,
  FIXME,
  traceLog,
} from '../utils/log'
import { DbTreeService } from './db-tree-service'
import {
  EventEmitter,
  Injectable,
  Injector,
} from '@angular/core'
import { sumBy } from 'lodash-es';
import { OryColumn } from '../tree-shared/OryColumn'
import { MultiMap } from '../utils/multi-map'
import {
  NodeOrderer,
  NodeOrderInfo,
} from './node-orderer'
import { PermissionsManager } from './PermissionsManager'
import {
  DbItem,
  ItemId,
  NodeInclusionId,
} from '../db/DbItem'
import {
  sumRecursivelyIncludingRoot,
  sumRecursivelyJustChildren,
} from '../utils/collection-utils'
import { HasItemData } from './has-item-data'
import { DataItemsService } from '../core/data-items.service'
import {
  minutesToString,
  parseTimeToMinutes,
} from '../utils/time-utils'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {TreeNode} from 'primeng/api'
import {isEmpty, nullOrUndef, uuidv4} from '../../../libs/AppFedShared/utils/utils-from-oryol'
import {lastItemOrUndefined} from '../../../libs/AppFedShared/utils/arrayUtils'
import {isNullish} from '../../../libs/AppFedShared/utils/utils'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {AuthService} from '../../../auth/auth.service'
import {TreeTableNode} from './TreeTableNode'
// import {TreeTableNode} from './TreeTableNode'

/**
 * Created by kd on 2017-10-27.
 *
 * NOTE: this file has both TreeModel and TreeNode to avoid a warning about circular dependency between files.
 * Maybe I will find a better way, perhaps involving refactor...
 */


/** ======================================================================================= */
/** TODO: this should be delegated to database as it might have its own conventions/implementation (e.g. firebase push id) */
let generateNewInclusionId = function () {
  return 'inclusion_' + uuidv4()
}


/** ======================================================================================= */
/** ======================================================================================= */
export class OryTreeNode<
  /** lowest-common type of nodes (can include root) */
  TBaseNode extends OryTreeNode<any> = OryTreeNode<any>,
  TBaseNonRootNode extends TBaseNode = TBaseNode, /* maybe this should be right after TBaseNode */
  TSiblingNode extends TBaseNonRootNode = TBaseNonRootNode,
  TAncestorNode extends TBaseNode = TBaseNode,
  // TParentNode extends TAncestorNode & OryTreeNode<TBaseNode, TBaseNonRootNode, TBaseNode, TBaseNode, TAncestorNode> = TAncestorNode,
  TParentNode extends TAncestorNode = TAncestorNode,
  TChildNode extends TBaseNonRootNode = TBaseNonRootNode,
  TData extends {
    title: string,
    isDone?: boolean,
  } = any,
> implements TreeNode, HasItemData {

  // ==== from PrimeNG's TreeNode:

  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  children: TChildNode[] = [];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: TreeNode;
  /** because `parent` is reset to null by the tree component if the node is top-level.
   * Possibly rename to parentEvenIfRoot or parentEvenIfTopLevel */
  parent2?: TParentNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;

  // ==== End of PrimeNG's TreeNode

  get title() {
    return this.itemData ?. title
  }

  /** TODO: rename to itemData$ and use CachedSubject to get initial val too;
   * TODO: unify with DbItem.data$ */
  onChangeItemData = new EventEmitter()
  onChangeItemDataOfChild = new EventEmitter()

  startTime = new Date()

  /** FIXME: not yet fully used because we are still using itemData */
  dbItem = this.treeModel.obtainItemById(this.itemId) // new DbItem(this.itemId)


  /** 2020-02-02 Decided that done/cancelled should be a core concept to tree node,
   * as it will simplify a lot of methods, at minimal cost in this file. Also, where else to put it... */
  public get isDoneOrCancelled() { return this.itemData?.isDone /* TODO: cancelled */ }

  public get hasChildren() {
    return this.numChildren > 0
  }

  public get numChildren() {
    return this.children ?. length ?? 0
  }


  static INITIAL_TITLE = ''

  expansion: any /* FIXME */ = new class Expansion {
    constructor(
      public treeNode: OryTreeNode<any, any, any, any>
    ) {}

    setExpansionOnParentsRecursively(expandToSet: boolean) {
      this.treeNode.getAncestorsPathArray().forEach(node => {
        node.expanded = expandToSet
      })
    }

    areParentsExpandedToMakeThisNodeVisible(): boolean {
      let ret: boolean
      if ( this.treeNode.isRoot ) {
        ret = this.treeNode.treeModel.isRootShown
      } else {
        const ancestorsPathArrayExcludingVirtualRoot = this.treeNode.getAncestorsPathArrayExcludingVirtualRoot()
        console.log(`ancestorsPathArrayExcludingVirtualRoot for node [${this.treeNode.itemData?.title}]`,
          ancestorsPathArrayExcludingVirtualRoot.map(node => `> ${node.title}`))
        ret = ancestorsPathArrayExcludingVirtualRoot.every(node => {
          return node.expanded
        })
      }
      console.log('areParentsExpandedToMakeThisNodeVisible ret', ret, this.treeNode.itemData?.title)
      return ret
      // return false
    }

    setExpanded(expansionState: boolean, recursive: boolean | {recursive: boolean}) {
      const recursiveAsOptions = (recursive as {recursive: boolean})
      if ( recursiveAsOptions && ! isNullish(recursiveAsOptions.recursive) ) {
        recursive = recursiveAsOptions.recursive
      }

      this.treeNode.expanded = expansionState
      if ( recursive ) {
        this.treeNode.children.forEach( (node: TChildNode) => {
          node.expansion.setExpanded(expansionState, recursive);
        });
      }
    }

    toggleExpansion(recursive: boolean) {
      this.setExpanded(! this.treeNode.expanded, recursive)
    }

  }(this)

  _removeChild(nodeToRemove: TChildNode) {
    this.children = this.children.filter(node => node !== nodeToRemove)
  }

  get isRoot(): boolean {
    return this.treeModel.root === this;
  }

  get isVisualRoot(): boolean {
    return this === this.treeModel.navigation.visualRoot
  }

  get lastChildNode(): TChildNode | undefined {
    return this.getChildAtIndexOrUndefined(this.children ?. length - 1)
  }

  get isDayPlan() {
    return this.parent2 ?. itemId === 'item_35023937-195c-4b9c-b265-5e8a01cf397e'
  }

  /** conceptual differences between note and journal entry: note is more pertaining to the topic,
   * whereas journal entry is more about the User's state in a given moment, useful for retrospective, tracking mood, etc. */
  get isJournalEntry() {
    return this.parent2 ?. itemId === 'item_50872811-928d-4878-94c0-0df36667be0e'
  }

  get isMilestone() {
    const milestonesNodeId = 'item_28cca5d5-6935-4fb1-907a-44f1f1898851'
    // return //this.parent2 && this.parent2.itemId === milestonesNodeId ||
    return this.parent2 ?. parent2 ?. itemId === milestonesNodeId
  }

  get isTask() {
    return this.parent2 ?. isMilestone || this.parent2 ?. isDayPlan
  }

  get isChildOfRoot() {
    return ! (this.parent2 ?. parent2) // top-level node (our parent is the virtual root)
  }

  constructor(
    public injector: Injector,
    public nodeInclusion: NodeInclusion | undefined | null,
    public itemId: string,
    public treeModel: TreeModel,
    public itemData: TData | null,
    // public item$: TItem$,
  ) {}

  addSiblingAfterThis(newNode?: TBaseNonRootNode) {
    return this.parent2!.addChild(this, newNode)
  }

  public getIndexInParent(): number {
    return this.parent2?.children?.indexOf(this) ?? 0
  }

  getSiblingNodeAboveThis(): TSiblingNode | undefined {
    const index = this.getIndexInParent()
    return this.parent2?.getChildAtIndexOrUndefined(index - 1) as TSiblingNode | undefined
  }

  getSiblingNodeBelowThis(): TBaseNonRootNode | undefined  {
    const index = this.getIndexInParent()
    // console.log('getNodeBelow index', index, 'count', this.parent2.children.length)
    const childAtIndexOrNull = this.parent2 ?. getChildAtIndexOrUndefined(index + 1)
    debugLog('getNodeBelow childAtIndexOrNull', childAtIndexOrNull)
    return childAtIndexOrNull as any as TBaseNonRootNode | undefined
  }

  getNodeVisuallyAboveThis(): TBaseNode | undefined {
    debugLog(`getNodeVisuallyAboveThis this.isVisualRoot`, this.isVisualRoot)
    if ( this.isVisualRoot ) {
      return this.treeModel.navigation.visualRoot.getLastMostNestedVisibleNodeRecursively()
    }
    let ret: TBaseNode | undefined
    const siblingNodeAboveThis = this.getSiblingNodeAboveThis()
    if ( siblingNodeAboveThis ) {
      const lastMostNestedNodeRecursively = siblingNodeAboveThis.getLastMostNestedVisibleNodeRecursively()
      ret =  lastMostNestedNodeRecursively as TBaseNode
    } else {
      ret = siblingNodeAboveThis ||
        this.parent2 || /* note this IS parent2 - should go to the root of all (if it is shown...) */
        this.treeModel.root.getLastMostNestedVisibleNodeRecursively() // not found -- wrap around to bottom-most
    }
    if ( ret!.expansion.areParentsExpandedToMakeThisNodeVisible()
        /* TODO: might need smth like && isVisible to handle the isRootVisible case. Later also think about filtering */
    ) {
      debugLog('getNodeVisuallyAboveThis 1')
      return ret
    } else {
      debugLog('getNodeVisuallyAboveThis 2')
      // recursive call:
      return ret?.getNodeVisuallyAboveThis() as TBaseNode | undefined // skip this one, as it is not visible via being collapsed
    }
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
    if ( simple ) {
      ret = simple
    } else {
      let parent: TAncestorNode | undefined = this.parent2
      while (parent && ! parent.isVisualRoot) {
        if ( parent.getSiblingNodeBelowThis() ) {
          ret =  parent.getSiblingNodeBelowThis() as TBaseNode
          break
        }
        parent = parent.parent2 as TAncestorNode
      }
    }
    debugLog(`getNodeVisuallyBelowThis(): not found - wrap around to top-most`)
    debugLog(`getNodeVisuallyBelowThis(): this.treeModel.navigation.visualRoot`, this.treeModel.navigation.visualRoot)
    ret = ret || this.treeModel.navigation.visualRoot // .children[0]
    if ( ! ret?.expansion.areParentsExpandedToMakeThisNodeVisible() ) {
      ret = ret?.getNodeVisuallyBelowThis() // recursive call
    }
    debugLog(`getNodeVisuallyBelowThis() ret`, ret)
    return ret
  }

  /** can also return this node */
  getLastMostNestedVisibleNodeRecursively(): TSiblingNode /* actually `this`, but `this` does not work like that */ | TChildNode | undefined {
    const lastDirectChild = this.getLastDirectChild()
    if ( lastDirectChild && ! lastDirectChild.expansion.areParentsExpandedToMakeThisNodeVisible() ) {
      return this as any as TSiblingNode // we stop at this because deeper one is not visible
    }
    if ( lastDirectChild ) {
      return lastDirectChild.getLastMostNestedVisibleNodeRecursively() as TChildNode
    } else {
      return this as any as TSiblingNode // workaround
    }
  }

  public getLastDirectChild(): TChildNode | undefined {
    return lastItemOrUndefined(this.children)
  }

  _appendChildAndSetThisAsParent(nodeToAppend?: TChildNode, insertBeforeIndex?: number) {
    // TODO: consider reacting to multi-node changes here for all nodes with the same
    nodeToAppend ??= this.createChildNode()
    const afterNode = this.lastChildNode

    if ( nullOrUndef(insertBeforeIndex) ) {
      insertBeforeIndex = this.children.length
    }
    if ( nullOrUndef(this.children) ) {
      this.children = []
    }
    nodeToAppend.parent = this
    nodeToAppend.parent2 = this

    // add node to other nodes of the same itemId:
    for ( const node of this.treeModel.getNodesByItemId(this.itemId)) {
      this.children.splice(insertBeforeIndex!, 0, nodeToAppend)
      this.treeModel.registerNode(nodeToAppend)
    }
    return nodeToAppend
  }

  protected newItemData() {
    return {title: OryTreeNode.INITIAL_TITLE}
  }

  getChildAtIndexOrUndefined(index: number): TChildNode | undefined {
    if ( this.isIndexPresent(index) ) {
      return this.children[index]
    } else {
      return undefined
    }
  }

  /** TODO: rename isItemIndexPresent */
  private isIndexPresent(index: number): boolean {
    const lastIndex = this.children.length - 1
    return ! (index < 0 || index > lastIndex);
  }

  /* TODO: should be called *create*, because it is a completely new node/item involving db, vs addChild just looks like tree-only operation */
  addChild(afterExistingNode?: TChildNode, newNode?: TChildNode): TChildNode {
    if ( ! afterExistingNode && this.children.length > 0 ) {
      afterExistingNode = this.lastChildNode
    }

    // console.log('addChild, afterExistingNode', afterExistingNode)
    newNode = newNode ?? this.createChildNode()

    const nodeBelow = afterExistingNode?.getSiblingNodeBelowThis()
    // console.log('addChild: nodeBelow', nodeBelow)
    const nodeInclusion: NodeInclusion = newNode.nodeInclusion || new NodeInclusion(generateNewInclusionId())

    this.treeModel.nodeOrderer.addOrderMetadataToInclusion(
      {
        inclusionBefore: afterExistingNode ?. nodeInclusion,
        inclusionAfter: nodeBelow ?. nodeInclusion,
      },
      nodeInclusion,
    )
    newNode.nodeInclusion = nodeInclusion

    this.treeModel.permissionsManager.onAfterCreated(newNode)

    this.treeModel.treeService.addChildNode(this, newNode)

    const newNodeIndex = afterExistingNode ? (afterExistingNode.getIndexInParent() + 1) : 0
    this._appendChildAndSetThisAsParent(newNode, newNodeIndex) // this is to avoid delay caused by Firestore; for UX
    // TODO: handle adding child in multiple parents; and this addChild method should actually accept DbItem instead of node, coz it really might create multiple nodes
    return newNode
  }

  protected createChildNode(): TChildNode {
    return new OryTreeNode(this.injector, undefined, 'item_' + uuidv4(), this.treeModel, this.newItemData()) as any as TChildNode
        // new TreeTableNode(newInclusion, nodeToAssociate.itemId, this.treeModel, nodeToAssociate.itemData) as TChildNode
  }

  addAssociationsHere(nodes: TChildNode[], beforeNode: TChildNode | undefined) {
    // FIXME: use beforeNode
    FIXME('addAssociationsHere not impl')
    for ( const nodeToAssociate of nodes ) {
      const newInclusion = new NodeInclusion(/* FIXME handle order */generateNewInclusionId())
      this.treeModel.nodeOrderer.addOrderMetadataToInclusion(
        {
          inclusionBefore: this.lastChildNode ?. nodeInclusion,
          inclusionAfter: undefined,
        },
        newInclusion,
      )

      const newNode = this.createChildNode()
      this.treeModel.treeService.addAssociateSiblingAfterNode(this, newNode, this.lastChildNode)
    }
  }

  /* This could/should probably be unified with reorder code */
  moveInclusionsHere(nodes: TChildNode[], beforeNode: { beforeNode: TChildNode | undefined }) {
    // FIXME('moveInclusionsHere: need to calculate order numbers to be last children')
    for ( const childNodeToAssociate of nodes ) {
      const nodeAfter = beforeNode?.beforeNode
      let nodeBefore = nodeAfter?.getSiblingNodeAboveThis()
      if ( ! nodeAfter && ! nodeBefore ) {
        // both nodeAfter and nodeBefore can become falsy, causing order == 0
        nodeBefore = this.lastChildNode
      }
      const inclusionToModify = childNodeToAssociate.nodeInclusion !
      this.treeModel.nodeOrderer.addOrderMetadataToInclusion(
        {
          inclusionBefore: nodeBefore?.nodeInclusion,
          inclusionAfter: nodeAfter?.nodeInclusion,
        },
        inclusionToModify
      )
      this.patchChildInclusionData(inclusionToModify, childNodeToAssociate)
      childNodeToAssociate.parent2!._removeChild(childNodeToAssociate)
      const insertionIndex = nodeAfter ? nodeAfter.getIndexInParent() : this.children.length
      this._appendChildAndSetThisAsParent(childNodeToAssociate, insertionIndex)
    }
  }

  private patchChildInclusionData(inclusionToModify: NodeInclusion, childNodeToAssociate: TChildNode) {
    this.treeModel.treeService.patchChildInclusionData(
      /*nodeToAssociate.itemId*/ this.itemId /* parent*/,
      inclusionToModify.nodeInclusionId,
      inclusionToModify,
      childNodeToAssociate.itemId,
    )
  }

  deleteWithoutConfirmation() {
    this.treeModel.treeService.deleteWithoutConfirmation(this.itemId)
    this.parent2!._removeChild(this)
  }

  patchItemData(itemDataPatch: any /* TData */) {
    // TODO this should use odmitem$
    Object.assign(this.itemData, itemDataPatch)
    let ret = this.treeModel.treeService.patchItemData(this.itemId, itemDataPatch)
    // TODO: fireOnChangeItemDataOfChildOnParents ?
    this.treeModel.dataItemsService.onItemWithDataPatchedByUserLocally$.next([this, itemDataPatch])
    this.dbItem.data$.next(this.itemData)
    return ret
    // this.itemData$.next()
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

    // this.patchChildInclusionData()
    this.treeModel.treeService.patchChildInclusionData(
      this.parent2!.itemId,
      this.nodeInclusion!.nodeInclusionId,
      inclusion,
      this.itemId
    )
  }

  // ======================================================
  // TODO: extract classes like TaskNodeContent, DayPlanNodeContent
  // since nodes are to allow changing their type, we would just swap an instance of the class mentioned above
  // the separation first would be mainly to separate generic node-logic from time-planning specific, etc.


  /** TODO: move to NumericCell */
  timeLeftSumText(column: OryColumn) {
    const minutesTotalLeft = this.valueLeftSum(column)
    return minutesToString(minutesTotalLeft)
  }

  /** TODO: move to NumericCell */
  valueLeftSum(column: OryColumn): number {
    const columnVal = column.getValueFromItemData(this.itemData)
    const selfTimeLeft = ( columnVal && parseTimeToMinutes(columnVal)) || 0
    // TODO: use AggregateValue class
    const childrenTimeLeftSum = this.getChildrenTimeLeftSum(column)
    return Math.max(selfTimeLeft, childrenTimeLeftSum)
  }

  getChildrenTimeLeftSum(column: OryColumn): number {
    return sumBy(this.children, childNode => {
      return childNode.effectiveValueLeft(column)
    })
  }

  hasMissingVal(column: OryColumn) {
    const valueFromItemData = column.getValueFromItemData(this.itemData)
    const hasField = this.hasField(column)
    if ( ! hasField ) {
      return false
    }
    /* TODO: could also use effective val (allowing calculated too) instead of plain user-entered
      however: this could cause O(n^2). Shortcut could be just to check if it has children.
     */
    return isEmpty(valueFromItemData)
  }

  /** TODO: move to NumericCell */
  missingValsCount(column: OryColumn) {
    return this.getChildrenMissingValsCount(column) + (this.hasMissingVal(column) ? 1 : 0)
    // const missingValsCount = count(this.children, )
    // return missingValsCount
  }

  getChildrenMissingValsCount(column: OryColumn) {
    const hasMissingValFunc = (node: TChildNode) => {
      return ! node.isDoneOrCancelled && node.hasMissingVal(column) // TODO: ignore done ones
    }

    const missingValsCountFunc = (node: TChildNode) => {
      if ( node.hasChildren ) {
        return 0 // will be taken care in children
      }
      return hasMissingValFunc(node) ? 1 : 0
    }
    return this.getSumRecursivelyJustChildren(missingValsCountFunc)
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

  /** TODO: move to NumericCell */
  effectiveValueLeft(column: OryColumn): number {
    if ( ! this.isDoneOrCancelled ) {
      if ( this.showEffectiveValue(column) ) {
        return this.valueLeftSum(column)
      }
      const estimatedTime = this.getMinutes(column)
      // console.log('estimatedTime for sum', estimatedTime)
      return estimatedTime
    } else {
      return 0
    }
  }

  public getMinutes(column: OryColumn) {
    const columnValue = this.getValueForColumn(column)
    return parseTimeToMinutes(columnValue) || 0
  }

  public getValueForColumn(column: OryColumn) {
    return column.getValueFromItemData(this.itemData)
  }

  /** TODO: move to NumericCell */
  effectiveTimeLeft(column: OryColumn) {
    return this.effectiveDurationText(column)
  }

  /** TODO: move to NumericCell (model class, not component */
  showEffectiveValue(column: OryColumn) {
    const colVal = column.getValueFromItemData(this.itemData)
    // if ( colVal ) console.log('showEffectiveValue colVal', colVal, typeof colVal)
    return ! this.isChildOfRoot &&
      ( /*this.itemData.estimatedTime == null || this.itemData.estimatedTime == undefined || */
        this.getChildrenTimeLeftSum(column) !== 0 /*||
        parseTimeToMinutes(colVal) >= 60*/ // TODO: move to domain-specific code since this deals with time (help reducing this file)
      )
  }

  /** TODO: move to NumericCell */
  effectiveDurationText(column: OryColumn) {
    return this.timeLeftSumText(column)
  }

  /** TODO: move to NumericCell */
  isChildrenEstimationExceedingOwn(column: OryColumn) {
    const colVal = column.getValueFromItemData(this.itemData)
    return ! isEmpty(colVal) &&
      this.valueLeftSum(column) >
      (( colVal && parseTimeToMinutes(colVal)) || 0) /* FIXME: there was "object is potentially null" so I added parenthesis 2022-06-18 */
  }

  endTime(column: OryColumn) {
    return new Date(this.startTime.getTime() + this.valueLeftSum(column) * 60 * 1000)
  }

  highlight: any /* FIXME */ = new class Highlight {
    constructor(public treeNode: OryTreeNode) {}

    isChildOfFocusedNode() {

    }

    isAncestorOfFocusedNode(): boolean {
      return !!(
        this.treeNode.treeModel.focus.lastFocusedNode?.getParentsPathArray().some((ancestorOfFocused: TBaseNode) => {
          return this.treeNode === ancestorOfFocused
        })
      )
    }
  } (this)

  getParentsPathArray(): TBaseNode[] {
    let ret: TBaseNode[] = []
    let node: TAncestorNode | undefined = this.parent2
    while (true) {
      if ( ! node ) {
        // debugLog('getAncestorsPathArray', ret)
        ret = ret.reverse()
        // debugLog(`getParentsPathArray for node [${this.itemData?.title}]`, ret.map(node => `> ${node.itemData?.title}`))

        return ret
      } else {
        ret.push(node)
        node = node.parent2 as TParentNode
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

  toggleDone() {
    let ret = this.patchItemData({
      isDone: this.itemData?.isDone ? null : new Date() /* TODO: `this.setDoneNow(! this.isDone)` */ ,
    })
    // FIXME: fireOnChangeItemDataOfChildOnParents and on this

    // TODO: focus node below, but too tied to UI; has to know about column too
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
    return this.treeModel.nodeOrderer.findInsertionIndexForNewInclusion<TChildNode>(this.children, newInclusion, (node: TChildNode) => {
      return node.nodeInclusion !
    })
  }

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

  hasField(attribute: OryColumn) {
    // return this.dbItem.hasField
    return true // HACK FIXME
  }

  getItemData() {
    // console.log('getItemData', this.itemData)
    return this.itemData
  }

  getId() {
    return this.itemId
  }
}

export abstract class OryTreeListener {
  abstract onAfterNodeMoved(): void
}

/** rename to TreeTableCell, as this deals with columns already */
export class TreeCell {
  constructor(
    public node?: OryTreeNode,
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
  TBaseNode extends OryTreeNode<any> = OryTreeNode<any>,
  TRootNode extends TBaseNode = TBaseNode,
  TNonRootNode extends TBaseNode = TBaseNode,
  TItemData = any,
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
        node = this.treeModel.getNodesByItemId(node)[0]
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
      console.log('this.visualRoot$.next(this.visualRoot!)', this.visualRoot)
      this.visualRoot$.next(this.visualRoot!)
    }

    navigateToParent() {
      const node = this.visualRoot?.parent2
      this.navigateInto(node)
    }

    navigateToRoot() {
      this.navigateInto(this.treeModel.root)
    }

  }(this)

  mapNodeInclusionIdToNodes = new MultiMap<NodeInclusionId, TBaseNode>()

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
  root: TRootNode = new OryTreeNode(this.injector, undefined, this.treeService.HARDCODED_ROOT_NODE_ITEM_ID, this, null) as any as TRootNode

  constructor(
    public injector: Injector,
    /* TODO Rename to dbTreeService */
    public treeService: DbTreeService,
    public authService: AuthService,
    public treeListener: OryTreeListener,
  ) {
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
          existingNode.itemData = event.itemData
          traceLog('existingNode.onChangeItemData.emit(event.itemData)', existingNode, existingNode.itemData)

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
              let insertBeforeIndex = parentNode.findInsertionIndexForNewInclusion(event.nodeInclusion)

              const newTreeNode = this.createTreeNode(event.nodeInclusion, event.itemId, event.itemData)
              parentNode._appendChildAndSetThisAsParent(newTreeNode, insertBeforeIndex)
              this.dataItemsService.onItemWithDataAdded$.next(newTreeNode)
              // console.log('onItemWithDataAdded$.next(newTreeNode)')
            }
          }
        }
      }
    } finally {
      this.isApplyingFromDbNow = false
    }
  }

  protected createTreeNode(nodeInclusion: NodeInclusion, itemId: ItemId, itemData: TItemData): TBaseNode {
    return new OryTreeNode(this.injector, nodeInclusion, itemId, this, itemData as any) as TBaseNode
  }

  /* Can unify this with moveInclusionsHere() */
  onNodeInclusionModified(nodeInclusionId: NodeInclusionId, nodeInclusionData: any, newParentItemId: ItemId) {
    // TODO: ensure this same code is executed locally immediately after reorder/move, without waiting for DB
    // if ( nodeInclusionData.parentNode)
    const nodes: TBaseNode[] | undefined = this.mapNodeInclusionIdToNodes.get(nodeInclusionId)
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

        newParent._appendChildAndSetThisAsParent(node, insertionIndex)
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

  registerNode(nodeToRegister: TBaseNode) {
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
