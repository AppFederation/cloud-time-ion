import {Injectable} from '@angular/core';
import {TimerId, TimerItem} from "./TimerItem";
import {TimersService} from "./timers.service";
import {debugLog, FIXME} from "../libs/AppFedShared/utils/log";
import {NotificationHandle, NotificationInfo} from "../libs/AppFedSharedIonic/notifications/PlatformNotificationsService";
import {NotificationsService} from "../libs/AppFedSharedIonic/notifications/notifications.service";
import {SchedulerHandle, SchedulerService} from "../libs/AppFedShared/scheduler/scheduler.service";
import {ModalController} from "@ionic/angular";
import {TimerDetailsComponent} from "../timers/timer-details/timer-details.component";
import {TimerEndedComponent} from "../timers/timer-ended/timer-ended.component";
import {TimerEndedService} from "../timers/timer-ended.service";

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

/* =============== SERVICE */
@Injectable()
export class TimerNotificationsService {

  mapIdToMeta = new Map<TimerId, TimerNotifMeta>()

  constructor(
    public notificationsService: NotificationsService,
    public timersService: TimersService,
    public schedulerService: SchedulerService,
    private modalController: ModalController,
    private timerEndedService: TimerEndedService,
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
    return this.schedulerService.schedule(timer.endTime, async () => {
      await this.timerEndedService.showTimerEnded(timer)
    })
  }
}
