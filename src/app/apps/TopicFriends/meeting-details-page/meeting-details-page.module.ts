import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetingDetailsPageRoutingModule } from './meeting-details-page-routing.module';
import {MeetingDetailsPage} from "./meeting-details.page";
import {MeetingsSharedModule} from "../meetings-shared/meetings-shared.module";

@NgModule({
  declarations: [
    MeetingDetailsPage,
  ],
  imports: [
    CommonModule,
    MeetingsSharedModule,
    MeetingDetailsPageRoutingModule
  ]
})
export class MeetingDetailsPageModule { }
