import { Injectable } from '@angular/core';
import {TreeNode} from 'primeng/primeng'
import {FirestoreTreeService} from './firestore-tree.service'
import {TreeModel} from './TreeModel'
import {NodeAddEvent} from './TreeListener'
import {DbTreeService} from './db-tree-service'


@Injectable()
export class TreeService {

  constructor(
    public dbTreeService: DbTreeService,
  ) { }

  getRootTreeModel(): TreeModel {
    // const componentThis = this
    const treeModel = new TreeModel(this.dbTreeService)
    this.dbTreeService.loadNodesTree({
      onNodeAdded(event: NodeAddEvent) {
        treeModel.onNodeAdded(event)
      }
    })
    return treeModel

  }
}
