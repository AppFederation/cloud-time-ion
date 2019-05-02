import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
const { LocalNotifications } = Plugins;

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

  constructor() {
  }

  notifyMe(text: string) {
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
          var notification = new Notification("Hi there!");
        }
      });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.

    var audio = new Audio('assets/cartoon-telephone_daniel_simion.mp3');
    // audio.loop = true
    // IDEA: gradually increase volume, so as not to bother other people in the vicinity
    // IDEA: exponential back-off
    audio.play().then(() => {
    });
  }
}
