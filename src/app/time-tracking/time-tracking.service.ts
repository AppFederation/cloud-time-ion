import { Injectable } from '@angular/core';
import { CachedSubject } from '../utils/CachedSubject'
import { debugLog } from '../utils/log'

export type TimeTrackable = any

@Injectable()
export class TimeTrackingService {

  timeTrackingOf$ = new CachedSubject<TimeTrackable>()

  constructor() { }

  startTimeTrackingOf(item) {
    debugLog('timeTrackingOf$', item, this.timeTrackingOf$)
    this.timeTrackingOf$.next(item)
    debugLog('timeTrackingOf$', this.timeTrackingOf$)
  }

  stopTimeTrackingOf(item) {
    this.timeTrackingOf$.next(null)
  }

  isTimeTracking(timeTrackable: TimeTrackable) {
    return this.timeTrackingOf$.lastVal === timeTrackable
  }
}
