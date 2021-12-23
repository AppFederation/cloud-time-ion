import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OdmTreeNodeComponent} from './tree-node/odm-tree-node.component'
import {OdmTreeComponent} from './tree/odm-tree.component'



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    OdmTreeNodeComponent,
    OdmTreeComponent,
  ],
  exports: [
    OdmTreeNodeComponent,
    OdmTreeComponent
  ]
})
export class OdmTreeModule { }
