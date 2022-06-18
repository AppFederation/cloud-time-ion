import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModerationTimersPageRoutingModule } from './moderation-timers-page-routing.module';
import { ModerationTimersPageComponent } from './moderation-timers-page.component';

@NgModule({
  declarations: [ModerationTimersPageComponent],
  imports: [
    CommonModule,
    ModerationTimersPageRoutingModule
  ]
})
export class ModerationTimersPageModule { }
