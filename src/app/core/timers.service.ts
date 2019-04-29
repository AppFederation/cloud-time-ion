import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Timer } from './Timer';

@Injectable({
  providedIn: 'root'
})
export class TimersService {

  timers$ = new ReplaySubject<Timer[]>(1)
  timers = []

  constructor() {
    this.emitTimers([
      new Timer('timerId1', undefined, 10, 'Laundry'),
      new Timer('timerId2', undefined, 2, 'Timer 2')
    ])
  }

  updateTimer(timer: Timer) {

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
