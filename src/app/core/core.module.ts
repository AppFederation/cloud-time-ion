import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OdmFirestoreModule} from "../odm-firestore/odm-firestore.module";
import {TimerNotificationsService} from "./timer-notifications.service";
import {TimersService} from "./timers.service";
import {NotificationsService} from "../notifications/notifications.service";
import {AngularFireAuthModule} from "@angular/fire/auth";
import {NotificationsModule} from "../notifications/notifications.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OdmFirestoreModule,
    AngularFireAuthModule,
    NotificationsModule,
  ],
  providers: [
    NotificationsService,
    TimerNotificationsService,
    TimersService,
  ]
})
export class CoreModule { }
