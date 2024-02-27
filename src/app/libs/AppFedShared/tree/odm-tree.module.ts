import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OdmTreeNodeComponent} from './tree-node/odm-tree-node.component'
import {OdmTreeComponent} from './tree/odm-tree.component'
import {IonicModule} from '@ionic/angular'
import {OdmTreeNodeContentComponent} from './tree-node/tree-node-content/odm-tree-node-content.component'
import {RichTextEditCellComponent} from './cells/rich-text-edit-cell/rich-text-edit-cell.component'
import {TreeNodeCellsComponent} from './tree-node/tree-node-content/tree-node-cells/tree-node-cells.component'
import {MinMidMaxCellComponent} from './cells/min-mid-max-cell/min-mid-max-cell.component'
import {SharedModule} from '../../../shared/shared.module'
import {OdmTreeNodePopupComponent} from './tree-node/odm-tree-node-popup/odm-tree-node-popup.component'
import {RouterLink} from '@angular/router'
import {OdmUiModule} from '../../AppFedSharedIonic/odm-ui/odm-ui.module'

const exportDeclarations = [
  MinMidMaxCellComponent,
  OdmTreeComponent,
  OdmTreeNodeComponent,
  OdmTreeNodeContentComponent,
  TreeNodeCellsComponent,
  OdmTreeNodePopupComponent,
  RichTextEditCellComponent,
]

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterLink,
    OdmUiModule,
  ],
  declarations: [
    ...exportDeclarations,
  ],
  exports: [
    ...exportDeclarations,
  ]
})
export class OdmTreeModule { }
