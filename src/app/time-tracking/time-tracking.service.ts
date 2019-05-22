import { Injectable } from '@angular/core';
import { CachedSubject } from '../utils/CachedSubject'
import { debugLog } from '../utils/log'

export type TimeTrackable = any

export class TimeTrackerEntry {
  constructor(
    public timeTrackable: TimeTrackable,
    public startTime: Date,
  ) {}
}

@Injectable()
export class TimeTrackingService {

  timeTrackingOf$ = new CachedSubject<TimeTrackable>()
  timeTracked$ = new CachedSubject<TimeTrackerEntry>()

  constructor() { }

  startTimeTrackingOf(item: TimeTrackable) {
    debugLog('before timeTrackingOf$', item, this.timeTrackingOf$)
    this.emitTimeTrackedEntry(new TimeTrackerEntry(
      item,
      new Date()
    ))
  }

  stopTimeTrackingOf(item?: TimeTrackable) {
    this.emitTimeTrackedEntry(null)
  }

  isTimeTracking(timeTrackable: TimeTrackable) {
    return this.timeTrackingOf$.lastVal === timeTrackable
  }

  private emitTimeTrackedEntry(entry: TimeTrackerEntry) {
    this.timeTrackingOf$.next(entry && entry.timeTrackable)
    this.timeTracked$.next(entry)
  }

}
