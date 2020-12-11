import { Injectable } from '@angular/core';
import { CachedSubject } from '../utils/CachedSubject'
import { debugLog } from '../utils/log'
import { TimeService } from '../core/time.service'
import { HasItemData } from '../tree-model/has-item-data'
import { DataItemsService } from '../core/data-items.service'
import {
  TimeTrackingPeriod,
  TimeTrackingPeriodsService,
} from './time-tracking-periods.service'

export type TimeTrackable = HasItemData

export function date(obj) {
  if ( ! obj ) {
    return null
  }
  if ( obj.toDate ) {
    return obj.toDate()
  }
  return obj
}

export class TimeTrackingPersistentData {
  whenFirstStarted?: Date

  // ==== tracking periods:
  previousTrackingsMs? : number

  nowTrackingSince?: Date

  // ==== tracking pause periods:
  previousPausesMs? : number

  /* could rename to nowPausedSince for consistency and much shorter */
  whenCurrentPauseStarted?: Date
}

export type TTPatch = Partial<TimeTrackingPersistentData>

export class TTFirstStartPatch implements TTPatch {
  nowTrackingSince = this.whenFirstStarted
  constructor(
    public whenFirstStarted : Date
  ) {}
}

export class TTResumePatch implements TTPatch {
  nowTrackingSince : Date
  previousPausesMs : number
  whenCurrentPauseStarted = null
}

export class TTPausePatch implements TTPatch {
  previousTrackingsMs : number
  /** TODO: rename to whenCurrentTrackingStarted ? */
  nowTrackingSince = null
  whenCurrentPauseStarted : Date
}

export class TimeTrackedEntry implements TimeTrackingPersistentData {

  public currentPeriod ? : TimeTrackingPeriod

  private timeoutHandles = []

  public get isTrackingNow() {
    // return this.wasTracked && ! this.isPaused
    return !! this.nowTrackingSince
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
    return this.nowMs() - this.nowTrackingSince
  }

  get totalMsExcludingPauses() {
    // return this.totalMsIncludingPauses - this.totalMsPaused
    return this.previousTrackingsMs + this.currentTrackingMsTillNow
  }

  get isPausedButWasTrackingBefore() { return !! this.whenCurrentPauseStarted }

  constructor(
    public timeTrackingService: TimeTrackingService,
    public timeTrackingPeriodsService: TimeTrackingPeriodsService,

  // public timeTrackable: TimeTrackable,
    public timeTrackable: TimeTrackable,

    public whenFirstStarted?: Date,

    public whenCurrentPauseStarted?: Date,
    public previousPausesMs: number = 0,
    public previousTrackingsMs: number = 0,
    public nowTrackingSince = null,
  ) {
    const itemData = this.timeTrackable.getItemData()
    const ttData = itemData && itemData.timeTrack
    // console.log('ttData', ttData)
    if ( ttData ) {
      ttData.whenFirstStarted =
        date(ttData.whenFirstStarted)
      ttData.nowTrackingSince =
        date(ttData.nowTrackingSince)
      ttData.whenCurrentPauseStarted =
        date(ttData.whenCurrentPauseStarted)
      Object.assign(this, ttData)
    }
  }

  startOrResumeTrackingIfNeeded() {
    if ( this.isTrackingNow ) {
      return
    }
    this.timeTrackingService.pauseCurrentOrNoop()
    this.nowTrackingSince = this.now()
    const dataItemPatch: TTPatch = {
      nowTrackingSince: this.now(),
    }
    if ( ! this.whenFirstStarted ) {
      // TODO: const patch = new TTFirstStartPatch(this.now())
      this.whenFirstStarted = this.now()
      dataItemPatch.whenFirstStarted = this.whenFirstStarted
      dataItemPatch.whenCurrentPauseStarted = null
    }
    // this.isTrackingNow = true
    if ( this.isPausedButWasTrackingBefore ) {
      this.previousPausesMs += this.currentPauseMsTillNow
      dataItemPatch.previousPausesMs = this.previousPausesMs
    }
    this.whenCurrentPauseStarted = null
    this.patchItemTimeTrackingData(dataItemPatch)
    this.timeTrackingService.emitTimeTrackedEntry(this)
    this.currentPeriod = this.timeTrackingPeriodsService.onPeriodStart(this)
  }

  pauseOrNoop() {
    if ( ! this.isTrackingNow ) {
      return
    }
    // TODO: const patch = new TTPausePatch(this.now())
    this.previousTrackingsMs += this.currentTrackingMsTillNow
    this.nowTrackingSince = null

    // this.isTrackingNow = false
    this.whenCurrentPauseStarted = this.now()
    const dataItemPatch: TTPausePatch = {
      whenCurrentPauseStarted: this.whenCurrentPauseStarted,
      nowTrackingSince: this.nowTrackingSince,
      previousTrackingsMs: this.previousTrackingsMs,
    }
    this.patchItemTimeTrackingData(dataItemPatch)
    this.clearTimeouts()
    this.timeTrackingService.emitTimeTrackedEntry(this)
    this.timeTrackingPeriodsService.onPeriodEnd(this)
    this.currentPeriod = undefined
  }

  private clearTimeouts() {
    for (const toh of this.timeoutHandles) {
      clearTimeout(toh)
    }
    this.timeoutHandles = []
  }

  private now(): Date {
    return this.timeTrackingService.now()
  }

  private nowMs(): number {
    return this.now().getTime()
  }

  // static of(timeTrackedItem: TimeTrackable) {
  //   return TimeTrackingService.the.obtainEntryForItem(timeTrackedItem)
  // }

  private patchItemTimeTrackingData(dataItemPatch: TTPatch) {
    // debugLog('patchItemTimeTrackingData', dataItemPatch)
    this.timeTrackable.patchItemData({
      /* NOTE: this is not per-user, but per-user could be emulated by adding a child node and tracking on it */
      timeTrack: {
        ... dataItemPatch,
        whenFirstStarted: this.whenFirstStarted /* || null */ /* quick way to not lose; real solution to use keys with dots
          like '{timeTrack.whenFirstStarted: xyz }'*/,
        previousTrackingsMs: this.previousTrackingsMs /* || null*/,
        previousPausesMs: this.previousPausesMs /* || null*/,
      },
    })
  }

  public notifyTrackedMsElapsedUntilPaused(msElapsedToNotify: number, callback: (entry?: TimeTrackedEntry) => void) {
    const delayFromNow = msElapsedToNotify - this.totalMsExcludingPauses
    if ( delayFromNow >= 0 ) {
      const timeoutHandle = setTimeout(() => {
        callback(this)
      }, delayFromNow)
      this.timeoutHandles.push(timeoutHandle)
    }
  }

  cancelAllNotifications() {
    this.clearTimeouts()
  }
}

/** ================================================================================================ */
@Injectable()
export class TimeTrackingService {

  private static _the: TimeTrackingService

  private mapItemToEntry = new Map<TimeTrackable, TimeTrackedEntry>()

  // static get the() {
  //   // console.log('TimeTrackingService the()')
  //   // console.trace('TimeTrackingService the()')
  //   return this._the || (this._the = new TimeTrackingService(new TimeService()))
  // }

  // timeTrackingOf$ = new CachedSubject<TimeTrackable>()

  timeTrackedEntries$ = new CachedSubject<TimeTrackedEntry[]>()

  get currentEntry() { return this.timeTrackedEntries$.lastVal }

  constructor(
    public timeService: TimeService,
    public dataItemsService: DataItemsService,
    private timeTrackingPeriodsService: TimeTrackingPeriodsService,
  ) {
    // console.log('TimeTrackingService constructor()')
    // console.trace('TimeTrackingService constructor()')
    if ( TimeTrackingService._the ) {
      return TimeTrackingService._the
      // throw new Error('TimeTrackingService._the already exists')
    } else {
      TimeTrackingService._the = this
    }

    // pause tracking of items which are done:
    this.dataItemsService.onItemWithDataPatchedByUserLocally$.subscribe(event => {
      if ( event[1].isDone /* truthy is enough; because it could be also timestamp */ ) {
        console.log('TimeTrackingService onItemWithDataPatchedByUserLocally$', event[1].isDone)
        this.pauseOrNoop(event[0])
      }
    })

    // detect item being tracked when loading from DB:
    this.dataItemsService.onItemWithDataAdded$.subscribe((dataItem) => {
      const itemData = dataItem.getItemData()
      const ttData: TimeTrackingPersistentData = itemData && itemData.timeTrack && itemData.timeTrack
      if ( ttData && ttData.nowTrackingSince &&
          (ttData.whenFirstStarted as any).toDate /* FIX for a string */ ) {
        console.log('onItemWithDataAdded$.subscribe ttData.nowTrackingSince', ttData.nowTrackingSince, ttData)
        const timeTrackedEntry = this.obtainEntryForItem(dataItem)
        this.emitTimeTrackedEntry(timeTrackedEntry)
      }
    })
  }

  // isTimeTracking(timeTrackable: TimeTrackable) {
  //   // return this.timeTrackingOf$.lastVal === timeTrackable
  // }

  emitTimeTrackedEntry(entry: TimeTrackedEntry) {
    console.log('emitTimeTrackedEntry', entry)
    // this.timeTrackingOf$.next(entry && entry.timeTrackable)
    this.timeTrackedEntries$.nextWithCache([entry] /* hack to emulate multi-tracking */)
  }

  now() {
    return this.timeService.now()
  }

  public obtainEntryForItem(timeTrackedItem: TimeTrackable) {
    let entry = this.mapItemToEntry.get(timeTrackedItem)
    if ( ! entry ) {
      entry = new TimeTrackedEntry(this, this.timeTrackingPeriodsService, timeTrackedItem)
      this.mapItemToEntry.set(timeTrackedItem, entry)
    }
    return entry
  }

  pauseCurrentOrNoop() {
    if ( this.currentEntry ) {
      for ( let entryToPause of this.currentEntry ) {
        entryToPause.pauseOrNoop()
      }
    }
  }

  public pauseOrNoop(timeTrackable: TimeTrackable) {
    this.obtainEntryForItem(timeTrackable).pauseOrNoop()
  }

}
