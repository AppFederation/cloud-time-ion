import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeTrackingService } from './time-tracking.service';
import { TimeTrackingCellComponent } from './time-tracking-cell/time-tracking-cell.component'
import { TimeModule } from '../AppFedSharedEmu/time/time.module'
import { TimeTrackingToolbarComponent } from './time-tracking-toolbar/time-tracking-toolbar.component'

const exports = [
  TimeTrackingCellComponent,
  TimeTrackingToolbarComponent,
]

@NgModule({
  declarations: [
    ...exports
    ],
  imports: [
    CommonModule,
    TimeModule,
  ],
  providers: [
    TimeTrackingService,
  ],
  exports: exports
})
export class TimeTrackingModule { }
