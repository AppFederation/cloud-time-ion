import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
import {Platform} from "@ionic/angular";
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

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
      public platform: Platform,
      // private localNotifications: LocalNotifications
  ) {
    (cordova.plugins as any).notification.local.schedule({
      title: 'CloudTime first notification',
      text: 'Notif text',
      foreground: true
    });
  }

  notifyMe(text: string) {
    this.playAudio();
    this.showNotification(text);
  }

  private showNotification(text: string) {
    if ( this.platform.is('android') ) {
      return
    }
// Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification(text);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          var notification = new Notification(text);
        }
      });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  }

  private playAudio() {
    var audio = new Audio('assets/cartoon-telephone_daniel_simion.mp3');
    // audio.loop = true
    // IDEA: gradually increase volume, so as not to bother other people in the vicinity
    // IDEA: exponential back-off
    audio.play().then(() => {
    });
  }
}
