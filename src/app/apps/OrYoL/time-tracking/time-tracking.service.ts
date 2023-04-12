import { Injectable } from '@angular/core';
import { debugLog } from '../utils/log'
import { TimeService } from '../core/time.service'
import {HasItemData, HasPatchThrottled} from '../tree-model/has-item-data'
import { OryItemsService } from '../core/ory-items.service'
import {
  TimeTrackingPeriod,
  TimeTrackingPeriodsService,
} from './time-tracking-periods.service'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {TimeoutHandle} from '../../../libs/AppFedShared/scheduler/scheduler.service'

export type TimeTrackable = HasPatchThrottled

export function date(obj: any) {
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

  nowTrackingSince: Date | null = null

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
  nowTrackingSince ! : Date
  previousPausesMs ! : number
  whenCurrentPauseStarted = null as any as undefined
}

export class TTPausePatch implements TTPatch {
  previousTrackingsMs! : number
  /** TODO: rename to whenCurrentTrackingStarted ? */
  nowTrackingSince = null as any as undefined /* FIXME */
  whenCurrentPauseStarted ! : Date
}

/* This + TimeTrackable could use the same mechanism as dynamically getting class
 * (items can change class at runtime for user editing convenience and flexibility -- user can change their mind which item type it is, even after entering info)
 * e.g.
 * item$.getClassInstance(Task) // or Milestone, Note, JournalEntry, etc.
 * item$.getClassInstance(TimeTrackable)
 * item$.hasClass(Task)
 *
 *
 * TimeTrackable being a sort of mixin which would work same as classes like Task, etc.
 * Probably most items (classes) would include the TimeTrackable mixin.
 *
 * Other mixins:
 * - Doable / Executable (`done`) -- TimeTrackable inherits from this
 * - Estimable / Estimatable
 * - ? Archivable ? (prolly built-in)
 * - Rateable (rating 5 stars etc; just an example)
 *
 * I can implement this gradually - gradually moving stuff from common classes like TreeTableNode / TreeTableContent, to specific mixins.
 *
 * A danger: having to re-implement object-oriented system, with inheritance, etc.
 * but maybe I can just swap normal js objects at runtime...
 *
 */
export class TimeTrackedEntry implements TimeTrackingPersistentData {

  public currentPeriod ? : TimeTrackingPeriod

  private timeoutHandles: TimeoutHandle[] = []

  public get isTrackingNow() {
    // return this.wasTracked && ! this.isPaused
    return !! this.nowTrackingSince
  }

  public get wasTracked() { return !! this.whenFirstStarted }

  get totalMsPaused() {
    return this.previousPausesMs + this.currentPauseMsTillNow
  }

  /** Could be useful for seeing e.g. which tasks have been started a long time ago and then abandoned */
  get totalMsIncludingPauses(): number {
    if ( ! this.whenFirstStarted ) {
      return 0
    }
    return this.nowMs() - this.whenFirstStarted.getTime() ! /* FIXME undefined ? */
  }

  get currentPauseMsTillNow() {
    if ( ! this.whenCurrentPauseStarted ) {
      return 0
    }
    return this.nowMs() - this.whenCurrentPauseStarted.getTime()
  }

  get currentTrackingMsTillNow() {
    if ( ! this.isTrackingNow || ! this.nowTrackingSince ) {
      return 0
    }
    return this.nowMs() - this.nowTrackingSince.getTime() ! /* FIXME undefined ? */
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
    public nowTrackingSince: Date | null = null,
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
      dataItemPatch.whenCurrentPauseStarted = null as any as undefined /* FIXME */
    }
    // this.isTrackingNow = true
    if ( this.isPausedButWasTrackingBefore ) {
      this.previousPausesMs += this.currentPauseMsTillNow
      dataItemPatch.previousPausesMs = this.previousPausesMs
    }
    this.whenCurrentPauseStarted = null as any as undefined /* FIXME */
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
      nowTrackingSince: this.nowTrackingSince as any as undefined /* FIXME */,
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
    // here it creates conflict with throttled setting of done
    this.timeTrackable.patchThrottled({
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
@Injectable({providedIn: 'root'})
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
    public dataItemsService: OryItemsService,
    private timeTrackingPeriodsService: TimeTrackingPeriodsService,
  ) {
    this.timeTrackingPeriodsService.activePeriods$.subscribe((periods: TimeTrackingPeriod[] | null | undefined) => {
      // this.
    })
    // console.log('TimeTrackingService constructor()')
    // console.trace('TimeTrackingService constructor()')
    if ( TimeTrackingService._the ) {
      return TimeTrackingService._the
      // throw new Error('TimeTrackingService._the already exists')
    } else {
      TimeTrackingService._the = this
    }

    // pause tracking of items which are done:
    this.dataItemsService.onItemWithDataPatchedByUserLocally$.subscribe((event: [HasItemData, any]) => {
      if ( event[1].isDone /* truthy is enough; because it could be also timestamp */ ) {
        // console.log('TimeTrackingService onItemWithDataPatchedByUserLocally$', event[1].isDone)
        const eventElement: HasItemData = event[0]
        this.pauseOrNoop(eventElement as TimeTrackable /* HACK */)
      }
    })

    // detect item being tracked when loading from DB: (probably this is not needed anymore since we query periods)
    this.dataItemsService.onItemAddedOrModified$.subscribe((dataItem: HasItemData) => {
      console.log('dataItemsService.onItemAddedOrModified$.subscribe', dataItem)
      // FIXME this only handles items added (when loading). Need smth like onItemWithDataModified, to handle time-tracking changes from remote
      const itemData = dataItem.getItemData()
      const ttData: TimeTrackingPersistentData = itemData && itemData.timeTrack && itemData.timeTrack
      if ( ttData && ttData.nowTrackingSince &&
          (ttData.whenFirstStarted as any).toDate /* FIX for a string */ ) {
        // console.log('onItemWithDataAdded$.subscribe ttData.nowTrackingSince', ttData.nowTrackingSince, ttData)
        const timeTrackedEntry = this.obtainEntryForItem(dataItem as TimeTrackable /* HACK */)
        this.emitTimeTrackedEntry(timeTrackedEntry)
      }
    })
  }

  // isTimeTracking(timeTrackable: TimeTrackable) {
  //   // return this.timeTrackingOf$.lastVal === timeTrackable
  // }

  emitTimeTrackedEntry(entry: TimeTrackedEntry) {
    // console.log('emitTimeTrackedEntry', entry)
    // this.timeTrackingOf$.next(entry && entry.timeTrackable)
    this.timeTrackedEntries$.nextWithCache([entry] /* hack to emulate multi-tracking */)
  }

  now() {
    return this.timeService.now()
  }

  public obtainEntryForItem(timeTrackedItem: TimeTrackable): TimeTrackedEntry {
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
