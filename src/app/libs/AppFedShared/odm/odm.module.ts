import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SyncStatusComponent} from './sync-status/sync-status.component'

@NgModule({
  declarations: [
    SyncStatusComponent,
  ],
  exports: [
    SyncStatusComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class OdmModule { }
