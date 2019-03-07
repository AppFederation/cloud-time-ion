import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NodeContentComponent} from './node-content/node-content.component'
import {TreeHostComponent} from '../tree-host/tree-host/tree-host.component'
import {NodeCellComponent} from './node-cell/node-cell.component'
import {TreeNodeMenuComponent} from './tree-node-menu/tree-node-menu.component'
import {ItemClassIconComponent} from './item-class-icon/item-class-icon.component'
import {ConfirmDeleteTreeNodeComponent} from './confirm-delete-tree-node/confirm-delete-tree-node.component'
import {TreePageComponent} from '../tree-page/tree-page/tree-page.component'
import {SharedModule} from '../shared/shared.module'
import {TreeNestedModule} from '../tree-nested/tree-nested.module'
import {TreePrimengModule} from '../tree-primeng/tree-primeng.module'

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
  ]
})
export class TreeSharedModule { }
