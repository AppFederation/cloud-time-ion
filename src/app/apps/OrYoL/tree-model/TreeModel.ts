import {NodeAddEvent} from './TreeListener'
import {debugLog, errorAlert, traceLog} from '../utils/log'
import {DbTreeService} from './db-tree-service'
import {EventEmitter, Injectable, Injector} from '@angular/core'
import {OryColumn} from '../tree-shared/OryColumn'
import {MultiMap} from '../utils/multi-map'
import {NodeOrderer} from './node-orderer'
import {PermissionsManager} from './PermissionsManager'
import {DbItem, ItemId, NodeInclusionId} from '../db/DbItem'
import {DataItemsService} from '../core/data-items.service'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {uuidv4} from '../../../libs/AppFedShared/utils/utils-from-oryol'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {AuthService} from '../../../auth/auth.service'
import {TreeTableNodeContent} from './TreeTableNodeContent'
import {OryTreeTableNodeContent} from './OryTreeTableNodeContent'
import {ApfNonRootTreeNode, RootTreeNode} from './TreeNode'
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


export type ApfBaseTreeNode = RootTreeNode<any>

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
    new OryTreeTableNodeContent(this.injector, this.treeService.HARDCODED_ROOT_NODE_ITEM_ID, {title: ''} as any

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
