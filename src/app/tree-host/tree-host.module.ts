import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TreeHostComponent} from './tree-host/tree-host.component'
import {TreePrimengModule} from '../tree-primeng/tree-primeng.module'
import {TreeNestedModule} from '../tree-nested/tree-nested.module';
import { ToolbarComponent } from './toolbar/toolbar.component'
import { TimeTrackingModule } from '../time-tracking/time-tracking.module'
import { TreeTableModule } from 'primeng/primeng'

/* Module used to embed a chosen implementation of tree (nested or primeng) and wire together */
@NgModule({
  imports: [
    CommonModule,
    TreePrimengModule,
    TreeNestedModule,
    TimeTrackingModule,
    TreeTableModule,
  ],
  declarations: [
    TreeHostComponent,
    ToolbarComponent,
  ],
  exports: [
    TreeHostComponent,
  ]
})
export class TreeHostModule { }
