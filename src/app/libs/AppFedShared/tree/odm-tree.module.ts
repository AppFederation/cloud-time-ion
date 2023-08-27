import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OdmTreeNodeComponent} from './tree-node/odm-tree-node.component'
import {OdmTreeComponent} from './tree/odm-tree.component'
import {IonicModule} from '@ionic/angular'
import {TreeNodeContentComponent} from './tree-node/tree-node-content/tree-node-content.component'
import {RichTextEditCellComponent} from './cells/rich-text-edit-cell/rich-text-edit-cell.component'
import {TreeNodeCellsComponent} from './tree-node/tree-node-content/tree-node-cells/tree-node-cells.component'
import {MinMidMaxCellComponent} from './cells/min-mid-max-cell/min-mid-max-cell.component'
import {SharedModule} from '../../../shared/shared.module'

const exportDeclarations = [
  MinMidMaxCellComponent,
  OdmTreeComponent,
  OdmTreeNodeComponent,
  TreeNodeContentComponent,
  TreeNodeCellsComponent,
  RichTextEditCellComponent,
]

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        SharedModule,
    ],
  declarations: [
    ...exportDeclarations,
  ],
  exports: [
    ...exportDeclarations,
  ]
})
export class OdmTreeModule { }
