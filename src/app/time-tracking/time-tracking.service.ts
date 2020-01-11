import { Injectable } from '@angular/core';
import { CachedSubject } from '../utils/CachedSubject'
import { debugLog } from '../utils/log'
import { TimeService } from '../core/time.service'
import { HasItemData } from '../tree-model/has-item-data'

export type TimeTrackable = HasItemData

export class TimeTrackedEntry {

  public isTrackingNow = false
  public wasTracked = false

  get totalMsPaused() {
    return this.previousPausesMs + this.currentPauseMsTillNow
  }

  /** Could be useful for seeing e.g. which tasks have been started a long time ago and then abandoned */
  get totalMsIncludingPauses() {
    return this.nowMs() - this.whenFirstStarted.getTime()
  }

  get currentPauseMsTillNow() {
    if ( ! this.whenCurrentPauseStarted ) {
      return 0
    }
    return this.nowMs() - this.whenCurrentPauseStarted.getTime()
  }

  get totalMsExcludingPauses() {
    return this.totalMsIncludingPauses - this.totalMsPaused
  }

  get isPaused() { return !! this.whenCurrentPauseStarted }

  constructor(
    public timeTrackingService: TimeTrackingService,
    // public timeTrackable: TimeTrackable,
    private itemWithData: HasItemData,

    public whenFirstStarted?: Date,
    public whenCurrentPauseStarted?: Date,
    public previousPausesMs: number = 0,
  ) {}

  startOrResumeTracking() {
    // this.treeNode.onChangeItemData
    //
    if ( ! this.whenFirstStarted ) {
      this.whenFirstStarted = this.now()
    }
    this.isTrackingNow = true
    this.wasTracked = true
    if ( this.isPaused ) {
      this.previousPausesMs += this.currentPauseMsTillNow
    }
    this.whenCurrentPauseStarted = null
    this.itemWithData.patchItemData({
      /* NOTE: this is not per-user, but per-user could be emulated by adding a child node and tracking on it */
      timeTrack: {
        // TODO: amount tracked so far
        currentTrackingSince: this.now(),
      }
    })
    TimeTrackingService.the.timeTrackedEntry$.next(this)
  }

  pause() {
    this.isTrackingNow = false
    this.whenCurrentPauseStarted = this.now()
  }

  private now(): Date {
    return this.timeTrackingService.now()
  }

  private nowMs(): number {
    return this.now().getTime()
  }

  static of(timeTrackedItem: HasItemData) {
    return TimeTrackingService.the.obtainEntryForItem(timeTrackedItem)
  }
}

// ================================================================================================

@Injectable()
export class TimeTrackingService {

  private static _the

  private mapItemToEntry = new Map<TimeTrackable, TimeTrackedEntry>()

  static get the() {
    // console.log('TimeTrackingService the()')
    // console.trace('TimeTrackingService the()')
    return this._the || (this._the = new TimeTrackingService(new TimeService()))
  }

  // timeTrackingOf$ = new CachedSubject<TimeTrackable>()
  timeTrackedEntry$ = new CachedSubject<TimeTrackedEntry>()
  get currentEntry() { return this.timeTrackedEntry$.lastVal }

  constructor(
    public timeService: TimeService,
  ) {
    // console.log('TimeTrackingService constructor()')
    // console.trace('TimeTrackingService constructor()')
    if ( TimeTrackingService._the ) {
      return TimeTrackingService._the
    } else {
      TimeTrackingService._the = this
    }
  }

  // startTimeTrackingOf(item: TimeTrackable) {
  //   // debugLog('before timeTrackingOf$', item, this.timeTrackingOf$)
  //   this.emitTimeTrackedEntry(new TimeTrackedEntry(
  //     item,
  //     new Date()
  //   ))
  // }
  //
  // stopTimeTrackingOf(item?: TimeTrackable) {
  //   this.emitTimeTrackedEntry(null)
  // }

  isTimeTracking(timeTrackable: TimeTrackable) {
    // return this.timeTrackingOf$.lastVal === timeTrackable
  }

  private emitTimeTrackedEntry(entry: TimeTrackedEntry) {
    // this.timeTrackingOf$.next(entry && entry.timeTrackable)
    this.timeTrackedEntry$.next(entry)
  }

  /* TODO: move to entry class for being able to track multiple things */
  resume() {
    const entry = this.currentEntry
    entry.previousPausesMs += entry.currentPauseMsTillNow
    entry.whenCurrentPauseStarted = null
  }

  /* TODO: move to entry class for being able to track multiple things */
  pause() {
    this.currentEntry.whenCurrentPauseStarted = this.timeService.now()
  }

  now() {
    return this.timeService.now()
  }

  obtainEntryForItem(timeTrackedItem: HasItemData) {
    let entry = this.mapItemToEntry.get(timeTrackedItem)
    if ( ! entry ) {
      entry = new TimeTrackedEntry(this, timeTrackedItem)
      this.mapItemToEntry.set(timeTrackedItem, entry)
    }
    return entry
  }
}
