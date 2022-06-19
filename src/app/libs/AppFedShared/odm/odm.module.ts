import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SyncStatusIconComponent} from './sync-status/sync-status-icon.component'
import {IonicModule} from '@ionic/angular'
import {SyncPopoverComponent} from './sync-status/sync-popover/sync-popover.component'

@NgModule({
  declarations: [
    SyncStatusIconComponent,
    SyncPopoverComponent,
  ],
  exports: [
    SyncStatusIconComponent,
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
