import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TreePageComponent} from './tree-page/tree-page.component'
import {TreeHostModule} from '../tree-host/tree-host.module'

@NgModule({
  declarations: [
    TreePageComponent,
  ],
  imports: [
    CommonModule,
    TreeHostModule,
  ],
  exports: [
  ]
})
export class TreePageModule { }
