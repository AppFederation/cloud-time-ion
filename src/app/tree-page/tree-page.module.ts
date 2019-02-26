import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TreeHostComponent} from './tree-host/tree-host.component'
import {TreeSharedModule} from '../tree/tree-shared.module'
import {TreePrimengModule} from '../tree-primeng/tree-primeng.module'
import {TreeNestedModule} from '../tree-nested/tree-nested.module'

@NgModule({
  declarations: [
    TreeHostComponent,
  ],
  imports: [
    CommonModule,
    TreeSharedModule,
    TreePrimengModule,
    TreeNestedModule,
  ],
  exports: [
    TreeHostComponent,
  ]
})
export class TreePageModule { }
