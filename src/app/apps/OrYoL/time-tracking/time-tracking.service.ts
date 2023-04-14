import {Injectable} from '@angular/core';
import {TimeService} from '../core/time.service'
import {HasItemData} from '../tree-model/has-item-data'
import {OryItemsService} from '../core/ory-items.service'
import {TimeTrackingPeriod, TimeTrackingPeriodsService} from './time-tracking-periods.service'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {TimeTrackedEntry} from './TimeTrackedEntry'
import {OryItem$} from '../db/OryItem$'
import {TimeTrackingPersistentData} from './TimeTrackingPersistentData'


export interface TimeTrackableItemData {
  timeTrack?: TimeTrackingPersistentData
}

export type TimeTrackable = OryItem$ //= HasPatchThrottled<TimeTrackableItemData>

export function date(obj: any) {
  if ( ! obj ) {
    return null
  }
  if ( obj.toDate ) {
    return obj.toDate()
  }
  return obj
}

export type TTPatch = Partial<TimeTrackingPersistentData> & {
  // /** whenLastTouched is mandatory for all operations */
  // whenLastTouched: Date | null
}

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
  nowTrackingSince = null // as any as undefined /* FIXME */
  whenCurrentPauseStarted ! : Date // TODO use this to still show it on toolbar
}

/** ================================================================================================ */
@Injectable({providedIn: 'root'})
export class TimeTrackingService {

  private static _the: TimeTrackingService

  // private mapItemToEntry = new Map<TimeTrackable, TimeTrackedEntry>()

  // static get the() {
  //   // console.log('TimeTrackingService the()')
  //   // console.trace('TimeTrackingService the()')
  //   return this._the || (this._the = new TimeTrackingService(new TimeService()))
  // }

  // timeTrackingOf$ = new CachedSubject<TimeTrackable>()

  timeTrackedEntries$ = new CachedSubject<TimeTrackedEntry[]>()

  /** undefined would mean in the future that no value has arrived yet */
  get currentEntries(): TimeTrackedEntry[] | undefined { return this.timeTrackedEntries$.lastVal }

  // TODO: currentlyTrackingEntries$
  // TODO: currentlyTrackingAndMruEntries$

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
    this.dataItemsService.onItemWithDataPatchedByUserLocally$.subscribe((event: [HasItemData<TimeTrackableItemData>, any]) => {
      const patch = event[1]
      if ( patch.isDone /* truthy is enough; because it could be also timestamp */ ) {
        // console.log('TimeTrackingService onItemWithDataPatchedByUserLocally$', event[1].isDone)
        const eventElement: HasItemData<TimeTrackableItemData> = event[0]
        this.pauseOrNoop(eventElement as TimeTrackable /* HACK */)
      }
    })

    // detect item being tracked when loading from DB: (probably this is not needed anymore since we query periods)
    this.dataItemsService.onItemAddedOrModified$.subscribe((addedOrModifiedDataItem: HasItemData<TimeTrackableItemData>) => {
      // FIXME this only handles items added (when loading). Need smth like onItemWithDataModified, to handle time-tracking changes from remote
      const itemData = addedOrModifiedDataItem.getItemData()
      const ttData: TimeTrackingPersistentData | undefined = itemData?.timeTrack
      if ( ttData?.nowTrackingSince &&
          (ttData?.whenFirstStarted as any)?.toDate /* FIX for a string */
      ) {
        // console.log('onItemWithDataAdded$.subscribe ttData.nowTrackingSince', ttData.nowTrackingSince, ttData)
        const timeTrackedEntry = this.obtainEntryForItem(addedOrModifiedDataItem as TimeTrackable /* HACK */)
        console.log('dataItemsService.onItemAddedOrModified$.subscribe has nowTrackingSince', addedOrModifiedDataItem, ttData, timeTrackedEntry)
        timeTrackedEntry.updateFromTimeTrackData(ttData) // TODO check if this is needed
        this.emitTimeTrackedEntry(timeTrackedEntry)

      } else {
        // if ( this.currentEntries?.some(entry => entry.timeTrackable.getId() === addedOrModifiedDataItem.getId()) ) {
        const timeTrackedEntry = this.currentEntries?.find(entry => entry.timeTrackable.getId() === addedOrModifiedDataItem.getId() )
        if ( timeTrackedEntry) {
          console.log(`onItemAddedOrModified$.subscribe item was on list of time tracked entries`, addedOrModifiedDataItem)
          // this.currentEntry[0].
          // this.timeTrackedEntries$.nextWithCache(this.currentEntries) // keep in mind that Object.assign there
            if ( ttData ) {
              timeTrackedEntry.updateFromTimeTrackData(ttData) // TODO check if this is needed
            }
            // timeTrackedEntry.updateFromTimeTrackData?.(addedOrModifiedDataItem.getItemData().timeTrack)
            this.emitTimeTrackedEntry(timeTrackedEntry)
          // }
          // this.timeTrackedEntries$.nextWithCache(this.currentEntry?.filter(entry =>
          //   entry.timeTrackable.getId() !== addedOrModifiedDataItem.getId())
          // ) // TODO maybe do not remove, coz might be paused and useful to still see previous item
        }
      }// TODO: else check if it was previously tracked, and remove from current entries

    })
  }

  // isTimeTracking(timeTrackable: TimeTrackable) {
  //   // return this.timeTrackingOf$.lastVal === timeTrackable
  // }

  emitTimeTrackedEntry(entry: TimeTrackedEntry) {
    let newEntriesArr = this.currentEntries || []
    // this.timeTrackingOf$.next(entry && entry.timeTrackable)
    if ( ! this.currentEntries?.includes(entry) ) {
      newEntriesArr = [...newEntriesArr, entry]
    }

    // if (
    //   && isDone
    //   && newEntriesArr.length > 1
    // ) {
    //   console.log('removing tt entry from array')
    // }

    if ( newEntriesArr.length > 1 ) {
      newEntriesArr = newEntriesArr.filter(e => {
        const isDone = e.timeTrackable.data$.lastVal?.isDone
        return e.val?.isTrackingNow || ! isDone
        // TODO: could make it so that all paused not-done items would still stay here
        /*
          if not tracking, and is done, we can remove it.
          in the future, I could leave the last such item for MRU sake
          or better, MRU should be a drop-down of history of tracked items
        */
      })
    }
    // console.log('emitTimeTrackedEntry', entry, newEntriesArr, `isDone`, isDone)

    // this.timeTrackedEntries$.nextWithCache([entry] /* hack to emulate multi-tracking */)
    // FIXME: ensure ALWAYS (not just for just-modified item) max 1 done not-currently-tracking item; sort by whenLastTouched
    this.timeTrackedEntries$.nextWithCache(newEntriesArr)
  }

  now() {
    return this.timeService.now()
  }

  public obtainEntryForItem(timeTrackedItem: TimeTrackable): TimeTrackedEntry {
    return timeTrackedItem.obtainDomainItem(TimeTrackedEntry)
    // let entry = this.mapItemToEntry.get(timeTrackedItem)
    // if ( ! entry ) {
    //   entry = new TimeTrackedEntry(this., timeTrackedItem)
    //   this.mapItemToEntry.set(timeTrackedItem, entry)
    // }
    // return entry
  }

  pauseCurrentOrNoop() {
    if ( this.currentEntries /* FIxME this is array so will always be non-nullish, e.g. []; also could contain MRU items; mruAndCurrentlyTrackingEntries */ ) {
      for ( let entryToPause of this.currentEntries ) {
        entryToPause.pauseOrNoop()
      }
    }
  }

  public pauseOrNoop(timeTrackable: TimeTrackable) {
    this.obtainEntryForItem(timeTrackable).pauseOrNoop()
  }

}
