import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OdmFirestoreModule} from "../odm-firestore/odm-firestore.module";
import {TimerNotificationsService} from "./timer-notifications.service";
import {TimersService} from "./timers.service";
import {NotificationsService} from "./notifications.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OdmFirestoreModule,
  ],
  providers: [
    NotificationsService,
    TimerNotificationsService,
    TimersService,
  ]
})
export class CoreModule { }
