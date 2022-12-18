import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TreeHostComponent} from './tree-host/tree-host.component'
import {TreePrimengModule} from '../tree-primeng/tree-primeng.module'
import {TreeNestedModule} from '../tree-nested/tree-nested.module';
import { ToolbarComponent } from './toolbar/toolbar.component'
import { TimeTrackingModule } from '../time-tracking/time-tracking.module'
import { TreeTableModule } from 'primeng/treetable'
import { OryolSharedModule } from '../shared/oryol-shared.module';
import { ToolbarPopoverComponent } from './toolbar/toolbar-popover/toolbar-popover.component'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { SearchModule } from '../search/search.module'
import {TreeSharedModule} from '../tree-shared/tree-shared.module'
import {OdmModule} from '../../../libs/AppFedShared/odm/odm.module'
import {NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap'
import {IonicModule} from '@ionic/angular'

/* Module used to embed a chosen implementation of tree (nested or primeng) and wire together */
@NgModule({
    imports: [
        CommonModule,
        TreePrimengModule,
        TreeNestedModule,
        TimeTrackingModule,
        TreeTableModule,
        OryolSharedModule,
        ReactiveFormsModule,
        RouterModule,
        SearchModule,
        TreeSharedModule,
        OryolSharedModule,
        OdmModule,
        NgbPopoverModule,
        IonicModule,
    ],
  declarations: [
    TreeHostComponent,
    ToolbarComponent,
    ToolbarPopoverComponent,
  ],
  exports: [
    TreeHostComponent,
  ]
})
export class TreeHostModule { }
