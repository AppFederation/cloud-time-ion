import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { Timer } from './Timer';
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class TimersService {

  timers$ = new ReplaySubject<Timer[]>(1)
  timers = []

  constructor(
      public notificationsService: NotificationsService,
      public angularFirestore: AngularFirestore,
  ) {
    this.angularFirestore.collection('testCol').valueChanges().subscribe((col) => {
      console.log('collection sub', col)
    })
    this.emitTimers([
      new Timer('timerId1', undefined, 3607, 'Laundry'),
      new Timer('timerId2', undefined, 300, 'Cooking'),
      new Timer('timerId2', undefined, 2, 'Quick timer test'),
    ])
  }

  updateTimer(timer: Timer) {
    if ( timer.durationSeconds ) {
      timer.endTime = new Date(Date.now() + timer.durationSeconds * 1000)
    }
    if ( timer.timeoutSubscription ) {
      clearTimeout(timer.timeoutSubscription)
    }
    timer.timeoutSubscription = setTimeout(() => {
      this.notifyTimerEnd(timer);
    }, timer.durationSeconds * 1000)
  }

  private notifyTimerEnd(timer: Timer) {
    alert('timeout for timer ' + timer.title)
    this.notificationsService.notifyMe('timeout for timer ' + timer.title)
  }

  add(timer: Timer) {
    this.timers.push(timer);
    this.emitTimers(this.timers)
  }

  private emitTimers(timers: Timer[]) {
    this.timers = timers
    this.timers$.next(timers)
  }
}
