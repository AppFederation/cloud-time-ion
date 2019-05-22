import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeTrackingService } from './time-tracking.service';
import { TimeTrackingToolbarComponent } from './time-tracking-toolbar/time-tracking-toolbar.component'
import { TimeModule } from '../AppFedSharedEmu/time/time.module'

const exports = [TimeTrackingToolbarComponent]

@NgModule({
  declarations: exports,
  imports: [
    CommonModule,
    TimeModule,
  ],
  providers: [
    TimeTrackingService,
  ],
  exports: [
    exports,
  ]
})
export class TimeTrackingModule { }
