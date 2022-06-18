import { Injectable } from '@angular/core';
import { TimeTrackedEntry } from './time-tracking.service'
// import Timestamp = firebase.firestore.Timestamp
import { ItemId } from '../db/DbItem'
import { uuidv4 } from '../utils/utils'
import { firestore1 } from '../db-firestore/firestore-tree.service'
import { firestore } from 'firebase'
import { errorAlert } from '../utils/log'
import { CachedSubject } from '../utils/cachedSubject2/CachedSubject2'

// https://lifesuite.innotopic.com/learn/item/lmm0ETQ1dvl9x6mJnNs5

export type TimeTrackingPeriodId = string

/** Ranges, (time) intervals, time period */
export class TimeTrackingPeriod {

  constructor(
    public id: TimeTrackingPeriodId,
    public itemId: ItemId,
    public start: firestore.Timestamp,
    public end : firestore.Timestamp | null /* null instead of missing, to be able to query for non-finished periods ! */,
    // TODO: approximate duration (in case manually entered
    // TODO: cancelled / is*Revoked* for when user forgets to stop tracking; but we still wanna show that tracking was started, in timeline
    // -- or `revoke` to save bytes
    // TODO: deleted / archived (undoable)
  ) {
  }

  static fromRaw(raw: TimeTrackingPeriod) {
    return raw
    // TimeTrackingPeriod.prototype.constructor.
  }
}



@Injectable({
  providedIn: 'root'
})
export class TimeTrackingPeriodsService {

  coll = firestore1.collection(`TimeTrackingPeriodTest`)

  activePeriods$ = new CachedSubject<TimeTrackingPeriod[] | null | undefined>(undefined)

  constructor(
  ) {
    // this.queryNotFinishedPeriods().get().then(queryResult => {
    //   console.log(`TimeTrackingPeriodTest query`, queryResult)
    // })
    this.queryNotFinishedPeriods().onSnapshot((x) => {
      console.log(`queryNotFinishedPeriods().onSnapshot`, x)
      for ( let doc of x.docs ) {
        console.log(`tt data`, doc.data())
        console.log(`tt itemId`, doc.data().itemId)
      }
      const array = x.docs.map(doc => TimeTrackingPeriod.fromRaw(doc.data() as TimeTrackingPeriod))
      this.activePeriods$.next(array)
    })
    // console.log( `firestore1.collection(\`TimeTrackingPeriodTest\`).add({testing: 'test'}) `)
    // coll.add({testing: 'test'})
  }

  private queryNotFinishedPeriods(): firestore.Query {
    return this.coll.where('end', '==', null)
  }

  onPeriodEnd(entry: TimeTrackedEntry) {
    let period: TimeTrackingPeriod = entry.currentPeriod
    if ( ! entry.currentPeriod ) {
      errorAlert('timetracking ! entry.currentPeriod -- TODO: need to load from DB (any periods with end==null and set at beginning')
      return
    }
    period.end = firestore.Timestamp.now()
    this.coll.doc(period.id).update({
      end: period.end
    }) // TODO id

    // TODO: update in DB
  }

  onPeriodStart(entry: TimeTrackedEntry) {
    const period = new TimeTrackingPeriod(
      uuidv4(),
      entry.timeTrackable.getId(),
      firestore.Timestamp.now(),
      null,
    )
    // TODO: push to DB collection "TimeTrackedEntry
    // this.coll.add(Object.assign({}, period))
    this.coll.doc(period.id).set(Object.assign({}, period))
    return period
//
//     FIXME
  }
}
