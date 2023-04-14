import {TimeTrackingPeriod, TimeTrackingPeriodsService} from './time-tracking-periods.service'
import {TimeoutHandle} from '../../../libs/AppFedShared/scheduler/scheduler.service'
import {date, TimeTrackable, TimeTrackingService, TTPatch, TTPausePatch} from './time-tracking.service'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {TimeMsDuration} from '../../../libs/AppFedShared/time/TimeMsDuration'
import {OryItem$} from '../db/OryItem$'
import {Injector} from '@angular/core'
import {TimeTrackingPersistentData} from './TimeTrackingPersistentData'

export class TimeTrackingJsObjVal extends TimeTrackingPersistentData {

  public get isTrackingNow() {
    // return this.wasTracked && ! this.isPaused
    return !!this.nowTrackingSince
  }

  public get wasTracked() {
    return !!this.whenFirstStarted
  }

  get isPausedButWasTrackingBefore() {
    return !!this.whenCurrentPauseStarted
  }
}

/** This + TimeTrackable could use the same mechanism as dynamically getting class
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
 * mixins / overlays / domain-extensions:
 * - TimeTrackable - even on object which user cannot modify - via overlay/paired item$
 * - Doable / Executable (`done`) -- TimeTrackable inherits from this
 * - Estimable / Estimatable
 * - ? Archivable ? (prolly built-in)
 * - Rateable (rating 5 stars etc; just an example)
 * - Self-Rateable, Quizzable etc. - even on object which user cannot modify - via overlay/paired item
 * - annotable -- annotating/modifying quiz items which user cannot modify directly.
 * - navigateable / focusable -- for navigating / focusing into items and MRU of navigation
 *
 * I can implement this gradually - gradually moving stuff from common classes like TreeTableNode / TreeTableContent, to specific mixins.
 *
 * A danger: having to re-implement object-oriented system, with inheritance, etc.
 * but maybe I can just swap normal js objects at runtime...
 *
 * This should set good precedents.
 */
export class TimeTrackedEntry /* extends OverlayOdmItem$ */ {

  /** val$? jsVal$? */
  timeTrackVal$ = new CachedSubject<TimeTrackingJsObjVal
      // { timeTrack:  | undefined
    /* that way more flexible,
    * can access some properties from the top-level object; or maybe could have separate observable origItemVal$; (maybe a bit arbitrary decision; re convenient vs clumsy etc.).
    * Though, working with one observable is better, coz atomicity, less subscriptions, etc.
    * Though there will be access to orig/underlying item$ anyway; but that obj will prolly not have the utility js methods.
    * Top-down-wise most important thing is that stuff like TT component can have easy access to both tt-specific stuff and also (if desired), access to orig item$,
    * via SAME @Input.
    *
    *     (timeTrackVal$ | async)?.isTrackingNow"
    * seems better than
    *     (timeTrackVal$ | async)?.timeTrack?.isTrackingNow
    * (too repetitive)
    *
    * timeTrackVal$ could be a convenience projection mappedCacheSubject.
    *
    * Let's not forget about a case where we get an item$ and we wanna access multiple kinds of overlays.
    * E.g. item$.getOverlay(TimeTrackedEntry), smth.
    * There should be easy access prolly both ways.
    *
    * Component might want general item stuff like title. Parents path for breadcrumb.
    *
    *  */
  // }
  | undefined>()

  public currentPeriod ?: TimeTrackingPeriod

  private timeoutHandles: TimeoutHandle[] = []

  // /** Prolly remove this field completely and rely on item$ */
  // ttData: any
  get ttData(): TimeTrackingJsObjVal | undefined {
    return this.timeTrackVal$.lastVal
  }

  /** jsVal ? */
  public get val() {
    return this.timeTrackVal$.lastVal
  }

  public get whenFirstStarted() { return this.ttData?.whenFirstStarted }

  public get whenCurrentPauseStarted() { return this.ttData?.whenCurrentPauseStarted }

  public get previousPausesMs() { return this.ttData?.previousPausesMs ?? 0 }

  public get previousTrackingsMs() {
    // return this.ttData?.previousPausesMs ?? 0
    return this.ttData?.previousTrackingsMs ?? 0 // there was the bug
  }

  public get nowTrackingSince() { return this.ttData?.nowTrackingSince }

  public timeTrackingService = this.injector.get(TimeTrackingService)
  public timeTrackingPeriodsService = this.injector.get(TimeTrackingPeriodsService)
  // // public timeTrackable: TimeTrackable,
  // public timeTrackable: TimeTrackable,

  constructor(
    public injector: Injector,
    public timeTrackable: TimeTrackable,
    // public whenFirstStarted?: Date,
    // public whenCurrentPauseStarted?: Date,
    // public previousPausesMs: number = 0,
    // public previousTrackingsMs: number = 0,
    // public nowTrackingSince: Date | null = null,
  ) {
    // const itemData = this.timeTrackable.getItemData()
    // const ttData = itemData?.timeTrack
    // console.log('ttData', ttData)
    // this.updateFromTimeTrackData(ttData)
    this.timeTrackable.data$.subscribe(val => {
      this.updateFromTimeTrackData(val.timeTrack)
    })

    // TODO:
    // TODO: source of truth: mappedCachedSubject based on orig item$
    // AND/BUT maybe the TimeTracked (Items) service wants to have a list of all the post-processed items too
  }

  public updateFromTimeTrackData(ttData: TimeTrackingPersistentData) {
    // FIXME: this should probably be this.timeTrackable.val$.pipe(map(.... to TimeTrackingJsObjVal)); though then we don't get .lastVal - but could make util func like that map
    // mappedCachedSubject(this.timeTrackable.val$, val => ...)
    const newVal = new TimeTrackingJsObjVal()

    if (ttData) {
      ttData.whenFirstStarted =
        date(ttData.whenFirstStarted)
      ttData.nowTrackingSince =
        date(ttData.nowTrackingSince)
      ttData.whenCurrentPauseStarted =
        date(ttData.whenCurrentPauseStarted)
      // Object.assign(this, ttData) // FIXME recipe for stale data
    }
    Object.assign(newVal, ttData)
    this.timeTrackVal$.nextWithCache(newVal)
    // this.ttData = ttData
  }

  startOrResumeTrackingIfNeeded(opts?: { inParallel: boolean}) {
    if (this.val?.isTrackingNow) {
      return
    }
    if ( ! opts?.inParallel ) {
      this.timeTrackingService.pauseCurrentOrNoop()
    }
    // this.ttData.nowTrackingSince = this.now() // FIXME this.ttData might be undefined; ??= {} ?
    const dataItemPatch: TTPatch = {
      nowTrackingSince: this.now(), // FIXME duplicate with above ttdata.
    }
    if (!this.whenFirstStarted) {
      // TODO: const patch = new TTFirstStartPatch(this.now())
      // this.ttData.whenFirstStarted = this.now()
      dataItemPatch.whenFirstStarted = this.now()
      // dataItemPatch.whenFirstStarted = this.whenFirstStarted
      // dataItemPatch.whenFirstStarted = null
      dataItemPatch.whenCurrentPauseStarted = null as any as undefined /* FIXME */
    }
    // this.isTrackingNow = true
    if (this.val?.isPausedButWasTrackingBefore) {
      // this.ttData.previousPausesMs += this.val?.currentPauseMsTillNow // FIXME make this into patch
      // dataItemPatch.previousPausesMs = this.previousPausesMs
      dataItemPatch.previousPausesMs = this.currentPauseMsTillNow + this.previousPausesMs /* TODO re-check new */
    }
    // this.ttData.whenCurrentPauseStarted = null as any as undefined /* FIXME */
    this.patchItemTimeTrackingData(dataItemPatch)
    this.timeTrackingService.emitTimeTrackedEntry(this) // this should not be needed anymore - source of truth is the obs$
    this.currentPeriod = this.timeTrackingPeriodsService.onPeriodStart(this)
  }

  get totalMsPaused() {
    return (this.previousPausesMs ?? 0) + this.currentPauseMsTillNow
  }

  get totalMsExcludingPauses(): TimeMsDuration {
    // return this.totalMsIncludingPauses - this.totalMsPaused
    return (this.previousTrackingsMs ?? 0) + this.currentTrackingMsTillNow
  }


  pauseOrNoop() {
    if (!this.val?.isTrackingNow) {
      return // no-op
    }
    // will pause:

    // TODO: const patch = new TTPausePatch(this.now())
    // this.ttData.previousTrackingsMs += this.currentTrackingMsTillNow
    // this.ttData.nowTrackingSince = null

    // this.isTrackingNow = false
    // this.ttData.whenCurrentPauseStarted = this.now()
    const dataItemPatch: TTPausePatch = {
      whenCurrentPauseStarted: this.now(), // this.whenCurrentPauseStarted,
      nowTrackingSince: null, //this.nowTrackingSince as any as undefined /* FIXME */,
      previousTrackingsMs: this.previousTrackingsMs + this.currentTrackingMsTillNow,
    }
    this.patchItemTimeTrackingData(dataItemPatch)
    this.clearTimeouts()
    this.timeTrackingService.emitTimeTrackedEntry(this) // this should not be needed - source of truth should be obs$
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
        whenFirstStarted: this.whenFirstStarted ?? null /* quick way to not lose; real solution to use keys with dots
          like '{timeTrack.whenFirstStarted: xyz }'*/,
        previousTrackingsMs: this.previousTrackingsMs ?? null,
        previousPausesMs: this.previousPausesMs ?? null,
        ...dataItemPatch,
      },
    })
  }

  public notifyTrackedMsElapsedUntilPaused(msElapsedToNotify: number, callback: (entry?: TimeTrackedEntry) => void) {
    const delayFromNow = msElapsedToNotify - this.totalMsExcludingPauses
    if (delayFromNow >= 0) {
      const timeoutHandle = setTimeout(() => {
        callback(this)
      }, delayFromNow)
      this.timeoutHandles.push(timeoutHandle)
    }
  }

  /** Could be useful for seeing e.g. which tasks have been started a long time ago and then abandoned */
  get totalMsIncludingPauses(): TimeMsDuration {
    if (!this.whenFirstStarted) {
      return 0
    }
    return this.nowMs() - this.whenFirstStarted.getTime() ! /* FIXME undefined ? */
  }

  get currentPauseMsTillNow(): TimeMsDuration {
    if (!this.whenCurrentPauseStarted) {
      return 0
    }
    return this.nowMs() - this.whenCurrentPauseStarted.getTime()
  }

  get currentTrackingMsTillNow(): TimeMsDuration {
    if (!this.val?.isTrackingNow || !this.nowTrackingSince) {
      return 0
    }
    return this.nowMs() - this.nowTrackingSince.getTime() ! /* FIXME undefined ? */
  }

  get isTrackingNow() {
    return this.val?.isTrackingNow
  }


  cancelAllNotifications() {
    this.clearTimeouts()
  }
}
