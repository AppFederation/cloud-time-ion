import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OdmTreeNodeComponent} from './tree-node/odm-tree-node.component'
import {OdmTreeComponent} from './tree/odm-tree.component'
import {IonicModule} from '@ionic/angular'
import {TreeNodeContentComponent} from './tree-node/tree-node-content/tree-node-content.component'
import {RichTextEditCellComponent} from './cells/rich-text-edit-cell/rich-text-edit-cell.component'



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [
    OdmTreeNodeComponent,
    OdmTreeComponent,
    TreeNodeContentComponent,
    RichTextEditCellComponent,
  ],
  exports: [
    OdmTreeComponent,
    OdmTreeNodeComponent,
    TreeNodeContentComponent,
  ]
})
export class OdmTreeModule { }
