import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { TimerItem } from './TimerItem';
import {AngularFirestore} from "@angular/fire/firestore";
import {errorAlert} from "../utils/log";

@Injectable({
  providedIn: 'root'
})
export class TimersService {

  timers$ = new ReplaySubject<TimerItem[]>(1)
  timers = []

  constructor(
      public notificationsService: NotificationsService,
      public angularFirestore: AngularFirestore,
  ) {
    angularFirestore.firestore.enablePersistence().then(() => {
      // window.alert('persistence enabled')
      this.timersCollection().valueChanges().subscribe((col) => {
        this.emitTimers(col.map(timer => {
          const timerInstance = Object.assign(Object.create(TimerItem.prototype), timer as any);
          // console.log('timerInstance', timerInstance)
          timerInstance.endTime = timerInstance.endTime.toDate()
          return timerInstance
        }))
      })
      // this.emitTimers([
      //   new TimerItem('timerId1', undefined, 3607, 'Laundry'),
      //   new TimerItem('timerId2', undefined, 300, 'Cooking'),
      //   new TimerItem('timerId2', undefined, 2, 'Quick timer test'),
      // ])

    }).catch((caught) => {
      errorAlert('enablePersistence error', caught)
    })


  }

  private timersCollection() {
    return this.angularFirestore.collection('Timers');
  }

  private timerDoc(timerId: string) {
    return this.timersCollection().doc(timerId)
  }

  updateTimer(timer: TimerItem) {
    this.save(timer)
  }

  private notifyTimerEnd(timer: TimerItem) {
    alert('timeout for timer ' + timer.title)
    this.notificationsService.notifyMe('timeout for timer ' + timer.title)
  }

  add(timer: TimerItem) {
    // this.timers.push(timer);
    // this.emitTimers(this.timers)
    this.save(timer)
  }

  private emitTimers(timers: TimerItem[]) {
    this.timers = timers
    this.timers$.next(timers)
  }

  public save(timer: TimerItem) {
    if ( timer.durationSeconds ) {
      timer.endTime = new Date(Date.now() + timer.durationSeconds * 1000)
    }
    if ( timer.timeoutSubscription ) {
      clearTimeout(timer.timeoutSubscription)
    }
    timer.timeoutSubscription = setTimeout(() => {
      this.notifyTimerEnd(timer);
    }, timer.durationSeconds * 1000)
    this.timerDoc(timer.id).set(Object.assign({}, timer))
  }

  public delete(timer: TimerItem) {
    this.timerDoc(timer.id).delete()
  }
}
