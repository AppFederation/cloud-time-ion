// import { Injectable } from '@angular/core'
// import { DbTreeService } from './db-tree-service'
// import { DbTreeListener } from './TreeListener'
// import { OryTreeNode } from './TreeModel'
//
// @Injectable()
// export class DbTreeServiceMock implements DbTreeService {
//
//   HARDCODED_ROOT_NODE_ITEM_ID = 'HARDCODED_ROOT_NODE_ITEM_ID'
//
//   dbTreeListener: DbTreeListener
//
//   addSiblingAfterNode() {
//   }
//
//   addChildNode() {
//   }
//
//   patchChildInclusionData(parentItemId: string, itemInclusionId: string, itemInclusionData: any) {
//     console.log('DbTreeMockService patchChildInclusionData', arguments)
//     this.dbTreeListener.onNodeInclusionModified(itemInclusionId, itemInclusionData, parentItemId) /* ! WARNING: this causes browser to hang !*/
//   }
//
//   loadNodesTree(dbTreeListener: DbTreeListener) {
//     this.dbTreeListener = dbTreeListener
//   }
//
//   deleteWithoutConfirmation(itemId: string) {
//   }
//
//   patchItemData(itemId: string, itemData: any) {
//   }
//
//   addAssociateSiblingAfterNode(
//       parentNode: OryTreeNode<any>,
//       nodeToAssociate: OryTreeNode<any>,
//       associateAfterNode: OryTreeNode<any>
//   ) {
//     throw new Error('Not implemented')
//   }
//
// }
