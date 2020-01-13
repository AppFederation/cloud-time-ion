import { Injectable } from '@angular/core';
import { CachedSubject } from '../utils/CachedSubject'
import { debugLog } from '../utils/log'
import { TimeService } from '../core/time.service'
import { HasItemData } from '../tree-model/has-item-data'

export type TimeTrackable = HasItemData

export class TimeTrackingPersistentData {
  whenFirstStarted?: Date

  // ==== tracking periods:
  previousTrackingsMs? : number
  /** TODO: rename to whenCurrentTrackingStarted ? */
  currentTrackingSince?: Date

  // ==== tracking pause periods:
  previousPausesMs? : number
  whenCurrentPauseStarted?: Date
}

export type TTPatch = Partial<TimeTrackingPersistentData>

export class TTFirstStartPatch implements TTPatch {
  currentTrackingSince = this.whenFirstStarted
  constructor(
    public whenFirstStarted : Date
  ) {}
}

export class TTResumePatch implements TTPatch {
  currentTrackingSince : Date
  previousPausesMs : number
  whenCurrentPauseStarted = null
}

export class TTPausePatch implements TTPatch {
  previousTrackingsMs : number
  /** TODO: rename to whenCurrentTrackingStarted ? */
  currentTrackingSince = null
  whenCurrentPauseStarted : Date
}

export class TimeTrackedEntry implements TimeTrackingPersistentData {

  public get isTrackingNow() {
    // return this.wasTracked && ! this.isPaused
    return !! this.currentTrackingSince
  }

  public get wasTracked() { return !! this.whenFirstStarted }

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

  get currentTrackingMsTillNow() {
    if ( ! this.isTrackingNow ) {
      return 0
    }
    return this.nowMs() - this.currentTrackingSince
  }

  get totalMsExcludingPauses() {
    // return this.totalMsIncludingPauses - this.totalMsPaused
    return this.previousTrackingsMs + this.currentTrackingMsTillNow
  }

  get isPaused() { return !! this.whenCurrentPauseStarted }

  constructor(
    public timeTrackingService: TimeTrackingService,
    // public timeTrackable: TimeTrackable,
    public itemWithData: TimeTrackable,

    public whenFirstStarted?: Date,

    public whenCurrentPauseStarted?: Date,
    public previousPausesMs: number = 0,
    public previousTrackingsMs: number = 0,
    public currentTrackingSince = null,
  ) {
    const itemData = this.itemWithData.getItemData()
    const ttData = itemData && itemData.timeTrack
    if ( ttData ) {
      ttData.whenFirstStarted =
        ttData.whenFirstStarted &&
        ttData.whenFirstStarted.toDate()
      ttData.currentTrackingSince =
        ttData.currentTrackingSince &&
        ttData.currentTrackingSince.toDate()
      ttData.whenCurrentPauseStarted =
        ttData.whenCurrentPauseStarted &&
        ttData.whenCurrentPauseStarted.toDate()
      Object.assign(this, ttData)
    }
  }

  startOrResumeTrackingIfNeeded() {
    if ( this.isTrackingNow ) {
      return
    }
    this.timeTrackingService.pauseCurrentOrNoop()
    this.currentTrackingSince = this.now()
    const dataItemPatch: TTPatch = {
      currentTrackingSince: this.now(),
    }
    if ( ! this.whenFirstStarted ) {
      // TODO: const patch = new TTFirstStartPatch(this.now())
      this.whenFirstStarted = this.now()
      dataItemPatch.whenFirstStarted = this.whenFirstStarted
      dataItemPatch.whenCurrentPauseStarted = null
    }
    // this.isTrackingNow = true
    if ( this.isPaused ) {
      this.previousPausesMs += this.currentPauseMsTillNow
      dataItemPatch.previousPausesMs = this.previousPausesMs
    }
    this.whenCurrentPauseStarted = null
    this.patchItemTimeTrackingData(dataItemPatch)
    TimeTrackingService.the.emitTimeTrackedEntry(this)
  }

  pauseOrNoop() {
    if ( this.isPaused ) {
      return
    }
    // TODO: const patch = new TTPausePatch(this.now())
    this.previousTrackingsMs += this.currentTrackingMsTillNow
    this.currentTrackingSince = null

    // this.isTrackingNow = false
    this.whenCurrentPauseStarted = this.now()
    const dataItemPatch: TTPausePatch = {
      whenCurrentPauseStarted: this.whenCurrentPauseStarted,
      currentTrackingSince: this.currentTrackingSince,
      previousTrackingsMs: this.previousTrackingsMs,
    }
    this.patchItemTimeTrackingData(dataItemPatch)
  }

  private now(): Date {
    return this.timeTrackingService.now()
  }

  private nowMs(): number {
    return this.now().getTime()
  }

  static of(timeTrackedItem: TimeTrackable) {
    return TimeTrackingService.the.obtainEntryForItem(timeTrackedItem)
  }

  private patchItemTimeTrackingData(dataItemPatch: TTPatch) {
    // debugLog('patchItemTimeTrackingData', dataItemPatch)
    this.itemWithData.patchItemData({
      /* NOTE: this is not per-user, but per-user could be emulated by adding a child node and tracking on it */
      timeTrack: {
        ... dataItemPatch,
        whenFirstStarted: this.whenFirstStarted /* quick way to not lose; real solution to use keys with dots
          like '{timeTrack.whenFirstStarted: xyz }'*/,
        previousTrackingsMs: this.previousTrackingsMs,
        previousPausesMs: this.previousPausesMs,
      },
    })
  }
}

/** ================================================================================================ */
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

  // isTimeTracking(timeTrackable: TimeTrackable) {
  //   // return this.timeTrackingOf$.lastVal === timeTrackable
  // }

  emitTimeTrackedEntry(entry: TimeTrackedEntry) {
    // this.timeTrackingOf$.next(entry && entry.timeTrackable)
    this.timeTrackedEntry$.next(entry)
  }

  now() {
    return this.timeService.now()
  }

  public obtainEntryForItem(timeTrackedItem: TimeTrackable) {
    let entry = this.mapItemToEntry.get(timeTrackedItem)
    if ( ! entry ) {
      entry = new TimeTrackedEntry(this, timeTrackedItem)
      this.mapItemToEntry.set(timeTrackedItem, entry)
    }
    return entry
  }

  pauseCurrentOrNoop() {
    if ( this.currentEntry ) {
      this.currentEntry.pauseOrNoop()
    }
  }
}
