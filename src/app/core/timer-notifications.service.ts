import { Injectable } from '@angular/core';
import {NotificationsService} from "./notifications.service";
import {TimerId, TimerItem} from "./TimerItem";
import {TimersService} from "./timers.service";
import {FIXME} from "../utils/log";

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
    this.timersService.localItems$.subscribe(timers => {
      this.clearTimeouts()
      FIXME('set alert notifs for timers', timers)
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
    this.notificationsService.notifyMe('timeout for timer ' + timer.title)
  }

  private setTimeout(timer: TimerItem) {
    // timer.timeoutSubscription = setTimeout(() => {
    //   this.notifyTimerEnd(timer);
    // }, timer.durationSeconds * 1000)
  }

}
