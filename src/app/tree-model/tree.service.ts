import { Injectable } from '@angular/core';
// import {
//   FirestoreTreeService,
// } from './firestore-tree.service'
import {TreeModel} from './TreeModel'
import {NodeAddEvent} from './TreeListener'
import {DbTreeService} from './db-tree-service'
import { debugLog } from '../utils/log'
import { AuthService } from '../core/auth.service'


@Injectable()
export class TreeService {

  constructor(
    public dbTreeService: DbTreeService,
    public authService: AuthService,
  ) { }

  getRootTreeModel(/* TODO: specify root node(s) ID(s) */): TreeModel {
    // const componentThis = this
    const treeModel = new TreeModel(this.dbTreeService, this.authService, {
      onAfterNodeMoved() {

      }
    })
    this.dbTreeService.loadNodesTree(/* TODO: specify root node(s) ID(s) */{
      onNodeAddedOrModified(event: NodeAddEvent) {
        debugLog('loadNodesTree onNodeAddedOrModified', event)
        treeModel.onNodeAdded(event)
      },
      onNodeInclusionModified(nodeInclusionId, nodeInclusionData, newParentItemId: string) {
        // TODO: entry point for moving node to different parent?
        treeModel.onNodeInclusionModified(nodeInclusionId, nodeInclusionData, newParentItemId)
      }
    })
    return treeModel

  }
}
