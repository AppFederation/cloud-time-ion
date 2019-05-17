import {Injectable} from '@angular/core';
import {TimerId, TimerItem} from "./TimerItem";
import {TimersService} from "./timers.service";
import {debugLog, FIXME} from "../utils/log";
import {NotificationHandle, NotificationInfo} from "../notifications/PlatformNotificationsService";
import {NotificationsService} from "../notifications/notifications.service";

class TimerNotifMeta {
  notificationHandle: NotificationHandle
}

@Injectable()
export class TimerNotificationsService {

  mapIdToMeta = new Map<TimerId, TimerNotifMeta>()

  constructor(
    public notificationsService: NotificationsService,
    public timersService: TimersService,
  ) {
    debugLog('TimerNotificationsService ctor')
    this.timersService.localItems$.subscribe(timers => {
      debugLog('TimerNotificationsService localItems$.subscribe')
      this.clearTimeouts()
      for ( const timer of timers ) {
        if ( timer.isRunning ) {
          this.mapIdToMeta.set(timer.id, {
            notificationHandle: this.scheduleNotification(timer)
          })
        }
      }
    })
  }

  public clearTimeouts() {
    debugLog('clearTimeouts()')
    for ( const notifMeta of this.mapIdToMeta.values() ) {
      if ( notifMeta.notificationHandle ) {
        this.notificationsService.cancelNotification(notifMeta.notificationHandle)
      }
    }
    this.mapIdToMeta.clear()
  }

  private scheduleNotification(timer: TimerItem) {
    debugLog('scheduleNotification', timer)
    return this.notificationsService.scheduleNotification(
      new NotificationInfo(`Timer finished: ${timer.title}`, timer.endTime)
    )
  }
}
