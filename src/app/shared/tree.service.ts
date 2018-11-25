import { Injectable } from '@angular/core';
import {TreeNode} from 'primeng/primeng'
import {
  FirestoreTreeService,
} from './firestore-tree.service'
import {TreeModel} from './TreeModel'
import {NodeAddEvent} from './TreeListener'
import {DbTreeService} from './db-tree-service'
import { debugLog } from './log'


@Injectable()
export class TreeService {

  constructor(
    public dbTreeService: DbTreeService,
  ) { }

  getRootTreeModel(/* TODO: specify root node(s) ID(s) */): TreeModel {
    // const componentThis = this
    const treeModel = new TreeModel(this.dbTreeService, {
      onAfterReorder() {

      }
    })
    this.dbTreeService.loadNodesTree(/* TODO: specify root node(s) ID(s) */{
      onNodeAdded(event: NodeAddEvent) {
        debugLog('loadNodesTree', event)
        treeModel.onNodeAdded(event)
      },
      onNodeInclusionModified(nodeInclusionId, nodeInclusionData) {
        treeModel.onNodeInclusionModified(nodeInclusionId, nodeInclusionData)
      }
    })
    return treeModel

  }
}
