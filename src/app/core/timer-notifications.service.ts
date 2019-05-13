import {Injectable} from '@angular/core';
import {NotificationsService} from "./notifications.service";
import {TimerId, TimerItem} from "./TimerItem";
import {TimersService} from "./timers.service";
import {debugLog, FIXME} from "../utils/log";
import {debuglog} from "util";

class TimerNotifMeta {
  timeoutSubscription: any
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
            timeoutSubscription: this.setTimeout(timer)
          })
        }
      }
      // FIXME('set alert notifs for timers', timers)
    })
  }

  public clearTimeouts() {
    for ( const notifMeta of this.mapIdToMeta.values() ) {
      if ( notifMeta.timeoutSubscription ) {
        clearTimeout(notifMeta.timeoutSubscription)
      }
    }
    this.mapIdToMeta.clear()
  }

  private notifyTimerEnd(timer: TimerItem) {
    // alert('timeout for timer ' + timer.title)
    this.notificationsService.notify('Timer ended: ' + timer.title)
  }

  private setTimeout(timer: TimerItem) {
    return setTimeout(() => {
      this.notifyTimerEnd(timer);
    }, timer.msLeft)
  }

}
