import {NodeInclusion} from './TreeListener'
import {Injectable} from '@angular/core'
import {ItemId} from '../db/DbItem'
import {ApfNonRootTreeNode, RootTreeNode, TreeModel} from './TreeModel'
//
// /**
//  * Created by kd on 2017-10-27.
//  *
//  * NOTE: this file has both TreeModel and TreeNode to avoid a warning about circular dependency between files.
//  * Maybe I will find a better way, perhaps involving refactor...
//  */
//
//
// /** =========================================================================== */
// /** =========================================================================== */
// /** ===========================================================================
//  */
// @Injectable()
// export class TreeTableModel<
//   TBaseNode extends RootTreeNode = RootTreeNode,
//   TRootNode extends TBaseNode = TBaseNode,
//   TNonRootNode extends TBaseNode = TBaseNode,
//   TItemData = any,
// > extends TreeModel<TBaseNode, TRootNode, TNonRootNode, TItemData>
// {
//   protected override createTreeNode(nodeInclusion: NodeInclusion, itemId: ItemId, itemData: TItemData): TBaseNode {
//     return new OryTreeNode(this.injector, nodeInclusion, itemId, this, itemData) as TBaseNode
//   }
//
// }
