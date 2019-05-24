import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NodeContentComponent} from './node-content/node-content.component'
import {NodeCellComponent} from './node-cell/node-cell.component'
import {TreeNodeMenuComponent} from './tree-node-menu/tree-node-menu.component'
import {ItemClassIconComponent} from './item-class-icon/item-class-icon.component'
import {ConfirmDeleteTreeNodeComponent} from './confirm-delete-tree-node/confirm-delete-tree-node.component'
import {SharedModule} from '../shared/shared.module';
import { TimeTrackingMenuComponent } from './tree-node-menu/time-tracking-menu/time-tracking-menu.component';
import { NodeContentTimeTrackingComponent } from './node-content-time-tracking/node-content-time-tracking.component'
import { TimeTrackingModule } from '../time-tracking/time-tracking.module'

/** Components reusable to be embedded in different tree implementations (e.g. node content) */
@NgModule({
  declarations: [
    NodeContentComponent,
    NodeCellComponent,
    TreeNodeMenuComponent,
    NodeContentComponent,
    ItemClassIconComponent,
    ConfirmDeleteTreeNodeComponent,
    TimeTrackingMenuComponent,
    NodeContentTimeTrackingComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TimeTrackingModule,
  ],
  exports: [
    NodeContentComponent,
  ],
  entryComponents: [
    ConfirmDeleteTreeNodeComponent,
  ],
})
export class TreeSharedModule { }
