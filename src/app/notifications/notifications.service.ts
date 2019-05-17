import {Injectable, Injector} from '@angular/core';

import { Plugins } from '@capacitor/core';
import {Platform} from "@ionic/angular";
import {CoreModule} from "../core/core.module";
import {BrowserNotificationsService} from "../notifications-browser/browser-notifications.service";
import {CordovaNotificationsService} from "../notifications-cordova/cordova-notifications.service";
import {NotificationHandle, NotificationInfo, PlatformNotificationsService} from "./PlatformNotificationsService";
import {debugLog} from "../utils/log";
// const { LocalNotifications } = Plugins;
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

// LocalNotifications.schedule({
//   notifications: [
//     {
//       title: "Title",
//       body: "Body",
//       id: 1,
//       schedule: { at: new Date(Date.now() + 1000 * 3) },
//       sound: null,
//       attachments: null,
//       actionTypeId: "",
//       extra: null
//     }
//   ]
// });


@Injectable()
export class NotificationsService {

  notificationsService: PlatformNotificationsService<any>
  platform = this.injector.get(Platform)

  constructor(
    public injector: Injector,
      // private localNotifications: LocalNotifications
  ) {
    debugLog('NotificationsService ctor')
    if ( this.platform.is('cordova') ) {
      this.notificationsService = injector.get(CordovaNotificationsService)
    } else {
      this.notificationsService = injector.get(BrowserNotificationsService)
    }
    document.addEventListener("deviceready", () => {
      // (cordova.plugins as any).notification.local.schedule({
      //   title: 'CloudTime first notification',
      //   text: 'Notif text',
      //   foreground: true
      // });
    }, false);
  }

  // notify(text: string) {
  //   this.playAudio();
  //   // this.showNotification(text);
  // }

  scheduleNotification(notifInfo: NotificationInfo): NotificationHandle {
    return this.notificationsService.scheduleNotificationImpl(notifInfo)
  }


  cancelNotification(notificationHandle: NotificationHandle) {
    return this.notificationsService.cancelNotificationImpl(notificationHandle)
  }
}
