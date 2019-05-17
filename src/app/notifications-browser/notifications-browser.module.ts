import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SchedulerModule} from "../scheduler/scheduler.module";
import {AudioModule} from "../audio/audio.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SchedulerModule,
    AudioModule,
  ]
})
export class NotificationsBrowserModule { }
