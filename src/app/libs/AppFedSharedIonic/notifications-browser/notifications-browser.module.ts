import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SchedulerModule} from "../../AppFedShared/scheduler/scheduler.module";
import {AudioModule} from "../../AppFedShared/audio/audio.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SchedulerModule,
    AudioModule,
  ]
})
export class NotificationsBrowserModule { }
