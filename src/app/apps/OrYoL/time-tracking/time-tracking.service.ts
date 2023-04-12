import {Injectable} from '@angular/core';
import {TimeService} from '../core/time.service'
import {HasItemData, HasPatchThrottled} from '../tree-model/has-item-data'
import {OryItemsService} from '../core/ory-items.service'
import {TimeTrackingPeriod, TimeTrackingPeriodsService} from './time-tracking-periods.service'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {TimeTrackedEntry} from './TimeTrackedEntry'

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
      const ttData: TimeTrackingPersistentData | undefined = itemData?.timeTrack
      if ( ttData?.nowTrackingSince &&
          (ttData?.whenFirstStarted as any).toDate /* FIX for a string */ ) {
        // console.log('onItemWithDataAdded$.subscribe ttData.nowTrackingSince', ttData.nowTrackingSince, ttData)
        const timeTrackedEntry = this.obtainEntryForItem(dataItem as TimeTrackable /* HACK */)
        this.emitTimeTrackedEntry(timeTrackedEntry)
      } // TODO: else check if it was previously tracked, and remove from current entries
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
