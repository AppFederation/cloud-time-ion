import {Injectable, Injector} from '@angular/core';
import {NotificationsBrowserModule} from "./notifications-browser.module";
import {NotificationHandle, NotificationInfo, PlatformNotificationsService} from "../notifications/PlatformNotificationsService";
import {SchedulerHandle, SchedulerService} from "../../AppFedShared/scheduler/scheduler.service";
import {AudioService} from "../../AppFedShared/audio/audio.service";

class BrowserNotifHandle extends NotificationHandle {
  constructor(
    notificationInfo: NotificationInfo,
    public browserNotificationsService: BrowserNotificationsService,
    public schedulerHandle: SchedulerHandle,
  ) {
    super(notificationInfo)
  }

  cancel() {
    this.schedulerHandle.unSchedule()
  }
}

@Injectable({
  providedIn: NotificationsBrowserModule,
})
export class BrowserNotificationsService extends PlatformNotificationsService<BrowserNotifHandle> {

  schedulerService = this.injector.get(SchedulerService)
  audioService = this.injector.get(AudioService)

  constructor(
    injector: Injector,
  ) {
    super(injector)
  }

  public scheduleNotificationImpl(notifInfo: NotificationInfo): BrowserNotifHandle {
    const schedulerHandle = this.schedulerService.schedule(notifInfo.when, () => {
      this.checkAndShowNotification(notifInfo);
    })
    return new BrowserNotifHandle(notifInfo, this, schedulerHandle)
  }

  private checkAndShowNotification(notifInfo: NotificationInfo) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      return this.showNotificationNow(notifInfo);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      // FIXME: requestPermission() should be called on app start or when first timer is scheduled
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          return this.showNotificationNow(notifInfo);
        }
      });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
    // KD: still can play sound
  }

  private showNotificationNow(notifInfo: NotificationInfo) {
    var notification = new Notification(notifInfo.title);
    this.audioService.playAudio('assets/audio/cartoon-telephone_daniel_simion.mp3')
  }

}
