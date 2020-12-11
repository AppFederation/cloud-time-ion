import { Injectable } from '@angular/core';
import { TimeTrackedEntry } from './time-tracking.service'
// import Timestamp = firebase.firestore.Timestamp
import { ItemId } from '../db/DbItem'
import { uuidv4 } from '../utils/utils'
import { firestore1 } from '../db-firestore/firestore-tree.service'
import { firestore } from 'firebase'
import { errorAlert } from '../utils/log'

export type TimeTrackingPeriodId = string

/** Ranges, (time) intervals, time period */
export class TimeTrackingPeriod {

  constructor(
    public id: TimeTrackingPeriodId,
    public itemId: ItemId,
    public start: firestore.Timestamp,
    public end : firestore.Timestamp | null /* null instead of missing, to be able to query for non-finished periods ! */,
  ) {
  }
}



@Injectable({
  providedIn: 'root'
})
export class TimeTrackingPeriodsService {

  coll = firestore1.collection(`TimeTrackingPeriodTest`)

  constructor(
  ) {
    console.log( `firestore1.collection(\`TimeTrackingPeriodTest\`).add({testing: 'test'}) `)
    // coll.add({testing: 'test'})
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
