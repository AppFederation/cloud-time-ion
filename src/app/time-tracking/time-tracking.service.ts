import { Injectable } from '@angular/core';
import { CachedSubject } from '../utils/CachedSubject'
import { debugLog } from '../utils/log'
import { OryTreeNode } from '../tree-model/TreeModel'

export type TimeTrackable = any

export class TimeTrackedEntry {
  public isTrackingNow = false
  public wasTracked = false

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
    // public timeTrackingService: TimeTrackingService,
    // public timeTrackable: TimeTrackable,
    private treeNode: OryTreeNode,
    public startTime?: Date,
    public whenLastPaused?,
    public previousPausesMs?,
  ) {}

  beginTimeTracking() {
    // this.treeNode.onChangeItemData
    //
    this.treeNode.patchItemData({
      timeTrack: {
        // TODO: amount tracked so far
        currentTrackingSince: new Date(),
      }
    })
    this.isTrackingNow = true
    this.wasTracked = true
    TimeTrackingService.the.timeTrackedEntry$.next(this)
  }

  pause() {
    this.isTrackingNow = false
  }
}

// ================================================================================================
@Injectable()
export class TimeTrackingService {

  private static _the
  static get the() {
    return this._the || (this._the = new TimeTrackingService())
  }

  // timeTrackingOf$ = new CachedSubject<TimeTrackable>()
  timeTrackedEntry$ = new CachedSubject<TimeTrackedEntry>()
  get currentEntry() { return this.timeTrackedEntry$.lastVal }

  constructor() {
    if ( TimeTrackingService._the ) {
      return TimeTrackingService._the
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
    entry.whenLastPaused = null
  }

  /* TODO: move to entry class for being able to track multiple things */
  pause() {
    this.currentEntry.whenLastPaused = new Date()
  }
}
