import {Injectable, Injector} from '@angular/core';
import {NotificationsCordovaModule} from "./notifications-cordova/notifications-cordova.module";
import {NotificationHandle, NotificationInfo, PlatformNotificationsService} from "./notifications/PlatformNotificationsService";
import {SchedulerHandle, SchedulerService} from "../AppFedShared/scheduler/scheduler.service";
import {AudioService} from "../AppFedShared/audio/audio.service";

class CordovaNotifHandle extends NotificationHandle {
  constructor(
    notificationInfo: NotificationInfo,
    public cordovaNotificationsService: CordovaNotificationsService,
    public intId: number,
    public schedulerHandle: SchedulerHandle,
  ) {
    super(notificationInfo)
  }

  cancel() {
    this.schedulerHandle.unSchedule()
    this.cordovaNotificationsService.cordovaLocalNotifs.cancel( [ this.intId ] )
  }
}

@Injectable({
  providedIn: NotificationsCordovaModule,
})
export class CordovaNotificationsService extends PlatformNotificationsService<CordovaNotifHandle> {

  /* Note: zero is unused */
  lastIntId = 0

  schedulerService = this.injector.get(SchedulerService)
  audioService = this.injector.get(AudioService)

  get cordovaLocalNotifs() { return (cordova.plugins as any).notification.local }

  constructor(
    injector: Injector,
  ) {
    super(injector)
  }

  public scheduleNotificationImpl(notifInfo: NotificationInfo): CordovaNotifHandle {
    const newIntId = ++ this.lastIntId
    let schedule = this.cordovaLocalNotifs.schedule({
      id: newIntId,
      title: notifInfo.title,
      text: '',
      foreground: true,
      trigger: { at: notifInfo.when },
      vibrate: true,
      // sound: true,
      sound: 'content://media/internal/audio/media/1',
      wakeup: true,
      priority: 1 /* PRIORITY_HIGH:
        https://developer.android.com/reference/android/app/Notification.html#PRIORITY_HIGH
        not PRIORITY_MAX, because PRIORITY_MAX seems to use RTC instead of RTC_WAKEUP in mgr.setExact(RTC, time, pi);
        */
    });
    console.log('scheduleNotification-d' + schedule +  JSON.stringify(schedule))
    let schedulerHandle = this.schedulerService.schedule(notifInfo.when, () => {
      this.audioService.playAudio('assets/audio/ali-a_intro.mp3')
    });
    return new CordovaNotifHandle(notifInfo, this, newIntId, schedulerHandle)
  }
}
