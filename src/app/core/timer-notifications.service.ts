import {Injectable} from '@angular/core';
import {TimerId, TimerItem} from "./TimerItem";
import {TimersService} from "./timers.service";
import {debugLog, FIXME} from "../utils/log";
import {NotificationHandle, NotificationInfo} from "../notifications/PlatformNotificationsService";
import {NotificationsService} from "../notifications/notifications.service";
import {SchedulerHandle, SchedulerService} from "../scheduler/scheduler.service";

class TimerNotifMeta {
  constructor(
    public timerNotificationsService: TimerNotificationsService,
    public notificationHandle: NotificationHandle,
    public schedulerHandle: SchedulerHandle,
  ) {}

  cancel() {
    if ( this.notificationHandle ) {
      this.notificationHandle.cancel()
    }
  }
}

@Injectable()
export class TimerNotificationsService {

  mapIdToMeta = new Map<TimerId, TimerNotifMeta>()

  constructor(
    public notificationsService: NotificationsService,
    public timersService: TimersService,
    public schedulerService: SchedulerService,
  ) {
    debugLog('TimerNotificationsService ctor')
    this.timersService.localItems$.subscribe(timers => {
      debugLog('TimerNotificationsService localItems$.subscribe')
      this.clearTimeouts()
      for ( const timer of timers ) {
        if ( timer.isRunning ) {
          this.mapIdToMeta.set(
            timer.id,
            new TimerNotifMeta(
              this,
              this.scheduleNotification(timer),
              this.scheduleTimerEnded(timer),
            )
          )
        }
      }
    })
  }

  public clearTimeouts() {
    debugLog('clearTimeouts()')
    for ( const notifMeta of this.mapIdToMeta.values() ) {
      notifMeta.cancel()
    }
    this.mapIdToMeta.clear()
  }

  private scheduleNotification(timer: TimerItem) {
    debugLog('scheduleNotification', timer)
    return this.notificationsService.scheduleNotification(
      new NotificationInfo(`Timer finished: ${timer.title}`, timer.endTime)
    )
  }

  private scheduleTimerEnded(timer: TimerItem) {
    return this.schedulerService.schedule(timer.endTime, () => {

    })
  }
}
