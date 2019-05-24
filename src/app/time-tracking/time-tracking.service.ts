import { Injectable } from '@angular/core';
import { CachedSubject } from '../utils/CachedSubject'
import { debugLog } from '../utils/log'

export type TimeTrackable = any

export class TimeTrackerEntry {
  get totalMsPaused() {
    return this.previousPausesMs + this.currentPauseMsTillNow
  }

  get totalMsIncludingPauses() {
    return Date.now() - this.startTime.getTime()
  }

  get currentPauseMsTillNow() {
    if ( ! this.whenLastPaused ) {
      return 0
    }
    return Date.now() - this.whenLastPaused
  }

  get totalMsExcludingPauses() {
    return this.totalMsIncludingPauses - this.totalMsPaused
  }

  get isPaused() { return !! this.whenLastPaused }

  constructor(
    public timeTrackable: TimeTrackable,
    public startTime: Date,
    public whenLastPaused = null,
    public previousPausesMs = 0,
  ) {}
}

@Injectable()
export class TimeTrackingService {

  timeTrackingOf$ = new CachedSubject<TimeTrackable>()
  timeTrackedEntry$ = new CachedSubject<TimeTrackerEntry>()
  get currentEntry() { return this.timeTrackedEntry$.lastVal }

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
    this.timeTrackedEntry$.next(entry)
  }

  /* TODO: move to entry class for being able to track multiple things */
  resume() {
    const entry = this.currentEntry
    entry.previousPausesMs += entry.currentPauseMsTillNow
    entry.whenLastPaused = null
  }

  /* TODO: move to entry class for being able to track multiple things */
  pause() {
    this.currentEntry.whenLastPaused = new Date()
  }
}
