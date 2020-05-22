import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SyncStatusComponent} from './sync-status/sync-status.component'
import {IonicModule} from '@ionic/angular'
import {SyncPopoverComponent} from './sync-status/sync-popover/sync-popover.component'

@NgModule({
  declarations: [
    SyncStatusComponent,
    SyncPopoverComponent,
  ],
  exports: [
    SyncStatusComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  entryComponents: [
    SyncPopoverComponent,
  ]
})
export class OdmModule { }
