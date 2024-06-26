import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TreePageComponent} from './tree-page/tree-page.component'
import {TreeHostModule} from '../tree-host/tree-host.module'
import { TreePageRoutingModule } from './tree-page.routing.module'
import {TreeSharedModule} from '../tree-shared/tree-shared.module'
import {IonicModule} from '@ionic/angular'
import {OdmModule} from '../../../libs/AppFedShared/odm/odm.module'
import {OryolSharedModule} from '../shared/oryol-shared.module'
import {SharedModule} from '../../../shared/shared.module'

@NgModule({
  declarations: [
    TreePageComponent,
  ],
  imports: [
    CommonModule,
    TreeHostModule,
    TreePageRoutingModule,
    TreeSharedModule,
    IonicModule,
    OdmModule,
    OryolSharedModule,
    OryolSharedModule,
    OryolSharedModule,
    SharedModule,
  ],
  exports: [
  ]
})
export class TreePageModule { }
