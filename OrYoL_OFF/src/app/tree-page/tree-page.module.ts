import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TreePageComponent} from './tree-page/tree-page.component'
import {TreeHostModule} from '../tree-host/tree-host.module'
import { TreePageRoutingModule } from './tree-page.routing.module'

@NgModule({
  declarations: [
    TreePageComponent,
  ],
  imports: [
    CommonModule,
    TreeHostModule,
    TreePageRoutingModule,
  ],
  exports: [
  ]
})
export class TreePageModule { }
