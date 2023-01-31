import {
  Injectable,
  Injector,
} from '@angular/core';
import {TreeModel} from './TreeModel'
import {NodeAddEvent} from './TreeListener'
import {DbTreeService} from './db-tree-service'
import { debugLog } from '../utils/log'
// import { AuthService } from '../core/auth.service'
import { TimeTrackingService } from '../time-tracking/time-tracking.service'
import {AuthService} from '../../../auth/auth.service'


@Injectable({providedIn: 'root'})
export class TreeService {

  constructor(
    public injector: Injector,
    public dbTreeService: DbTreeService,
    public authService: AuthService,
    public timeTrackingService: TimeTrackingService /* just to ensure it subscribes for events before loadNodesTree */,
  ) { }

  getRootTreeModel(/* TODO: specify root node(s) ID(s) */): TreeModel {
    // const componentThis = this
    const treeModel = new TreeModel(this.injector, this.dbTreeService, this.authService, {
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
