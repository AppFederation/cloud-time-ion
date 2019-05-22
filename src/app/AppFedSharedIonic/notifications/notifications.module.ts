import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NotificationsCordovaModule} from "../notifications-cordova/notifications-cordova.module";
import {NotificationsBrowserModule} from "../notifications-browser/notifications-browser.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationsCordovaModule,
    NotificationsBrowserModule,
  ]
})
export class NotificationsModule { }
