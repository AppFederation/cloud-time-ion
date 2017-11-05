import { Injectable } from '@angular/core';
import {TreeNode} from 'primeng/primeng'
import {FirestoreTreeService} from './firestore-tree.service'
import {NodeAddEvent, TreeModel} from './TreeModel'





@Injectable()
export class TreeService {

  constructor(
    public firestoreTreeService: FirestoreTreeService,
  ) { }

  getRootTreeModel(): TreeModel {
    // const componentThis = this
    const treeModel = new TreeModel()
    this.firestoreTreeService.loadNodesTree({
      onNodeAdded(event: NodeAddEvent) {
        treeModel.onNodeAdded(event)
      }
    })
    return treeModel

  }
}
