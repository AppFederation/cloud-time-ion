import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NodeContentComponent} from './node-content/node-content.component'
import {NodeCellComponent} from './node-cell/node-cell.component'
import {TreeNodeMenuComponent} from './tree-node-menu/tree-node-menu.component'
import {ItemClassIconComponent} from './item-class-icon/item-class-icon.component'
import {ConfirmDeleteTreeNodeComponent} from './confirm-delete-tree-node/confirm-delete-tree-node.component'
import {SharedModule} from '../shared/shared.module'

/** Components reusable to be embedded in different tree implementations (e.g. node content) */
@NgModule({
  declarations: [
    NodeContentComponent,
    NodeCellComponent,
    TreeNodeMenuComponent,
    NodeContentComponent,
    ItemClassIconComponent,
    ConfirmDeleteTreeNodeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    NodeContentComponent,
  ],
  entryComponents: [
    ConfirmDeleteTreeNodeComponent,
  ],
})
export class TreeSharedModule { }
