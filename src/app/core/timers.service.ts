import { Injectable } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { TimerItem } from './TimerItem';
import {AngularFirestore} from "@angular/fire/firestore";
import {errorAlert} from "../utils/log";
import {CoreModule} from "./core.module";
import {ignorePromise} from "../utils/promiseUtils";
import {CachedSubject} from "../utils/CachedSubject";


@Injectable({
  providedIn: CoreModule,
})
export class TimersService {

  timers$ = new CachedSubject<TimerItem[]>([])

  constructor(
      public notificationsService: NotificationsService,
      public angularFirestore: AngularFirestore,
  ) {
    angularFirestore.firestore.enablePersistence().then(() => {
      // window.alert('persistence enabled')
      this.clearTimeouts()
      this.timersCollection().valueChanges().subscribe((col) => {
        this.emitTimers(col.map(timer => {
          const timerInstance = Object.assign(Object.create(TimerItem.prototype), timer as any);
          // console.log('timerInstance', timerInstance)
          timerInstance.endTime = timerInstance.endTime.toDate()
          this.setTimeout(timerInstance);

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
    // alert('timeout for timer ' + timer.title)
    this.notificationsService.notifyMe('timeout for timer ' + timer.title)
  }

  add(timer: TimerItem) {
    // this.timers.push(timer);
    // this.emitTimers(this.timers)
    this.save(timer)
  }

  private emitTimers(timers: TimerItem[]) {
    this.timers$.next(timers)
  }

  public save(timer: TimerItem) {
    if ( timer.durationSeconds ) {
      timer.endTime = new Date(Date.now() + timer.durationSeconds * 1000)
    }
    if ( timer.timeoutSubscription ) {
      clearTimeout(timer.timeoutSubscription)
    }
    this.setTimeout(timer);
    ignorePromise(this.timerDoc(timer.id).set(Object.assign({}, timer)))
  }

  private setTimeout(timer: TimerItem) {
    timer.timeoutSubscription = setTimeout(() => {
      this.notifyTimerEnd(timer);
    }, timer.durationSeconds * 1000)
  }

  public delete(timer: TimerItem) {
    ignorePromise(this.timerDoc(timer.id).delete())
  }

  private clearTimeouts() {
    for ( const timer of this.timers$.last ) {
      if ( timer.timeoutSubscription ) {
        clearTimeout(timer.timeoutSubscription)
      }
    }
  }

  patch(timer: TimerItem, patchVal: Partial<TimerItem>) {
    ignorePromise(this.timerDoc(timer.id).update(patchVal))
  }
}
