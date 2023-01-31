import {Injectable, Injector} from '@angular/core';
import { TimeTrackedEntry } from './time-tracking.service'
// import Timestamp = firebase.firestore.Timestamp
import { ItemId } from '../db/DbItem'
import { errorAlert } from '../utils/log'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {uuidv4} from '../../../libs/AppFedShared/utils/utils-from-oryol'
import {BaseService} from '../../../libs/AppFedShared/base.service'
import {FeatureLevelsConfig} from '../../../libs/AppFedShared/FeatureLevelsConfig'
import firebase from 'firebase/compat'
import Timestamp = firebase.firestore.Timestamp
import firestore from 'firebase/compat'
import {AngularFirestore, Query} from '@angular/fire/compat/firestore'

// https://lifesuite.innotopic.com/learn/item/lmm0ETQ1dvl9x6mJnNs5

export type TimeTrackingPeriodId = string

/** Ranges, (time) intervals, time period */
export class TimeTrackingPeriod {

  constructor(
    public id: TimeTrackingPeriodId,
    public itemId: ItemId,
    public start: Timestamp,
    public end : Timestamp | null /* null instead of missing, to be able to query for non-finished periods ! */,
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
export class TimeTrackingPeriodsService extends BaseService {

  coll = this.angularFire.collection(`TimeTrackingPeriodTest`)

  activePeriods$ = new CachedSubject<TimeTrackingPeriod[] | null | undefined>(undefined)

  constructor(
    injector: Injector,
    protected angularFire: AngularFirestore,
  ) {
    super(injector)
    this.featLocal = this.g.feat.timeTrackingPeriods
    // this.queryNotFinishedPeriods().get().then(queryResult => {
    //   console.log(`TimeTrackingPeriodTest query`, queryResult)
    // })

    // ==== BEGIN disabled 2023-01-31 when updating firestore
    // this.queryNotFinishedPeriods().onSnapshot((x: any) => {
    //   console.log(`queryNotFinishedPeriods().onSnapshot`, x)
    //   for ( let doc of x.docs ) {
    //     console.log(`tt data`, doc.data())
    //     console.log(`tt itemId`, doc.data().itemId)
    //   }
    //   const array = x.docs.map((doc: any) => TimeTrackingPeriod.fromRaw(doc.data() as TimeTrackingPeriod))
    //   this.activePeriods$.next(array)
    // })
    // ==== END disabled 2023-01-31 when updating firestore

    // console.log( `firestore1.collection(\`TimeTrackingPeriodTest\`).add({testing: 'test'}) `)
    // coll.add({testing: 'test'})
  }


  // private queryNotFinishedPeriods(): Query {
  // Disabled when updating angularfire
  //   // return this.coll.where('end', '==', null)
  // }

  onPeriodEnd(entry: TimeTrackedEntry) {
    let period: TimeTrackingPeriod | undefined = entry.currentPeriod
    if ( ! period ) {
      if ( this.feat.unfinished && this.feat.showFixmes /* though; this.feat should already handle the `.timetracking.periods` */ ) {
        console.error('timetracking ! entry.currentPeriod -- TODO: need to load from DB (any periods with end==null and set at beginning')
      }
      return
    }
    period.end = Timestamp.now()
    this.coll.doc(period.id).update({
      end: period.end
    }) // TODO id

    // TODO: update in DB
  }

  onPeriodStart(entry: TimeTrackedEntry) {
    const period = new TimeTrackingPeriod(
      uuidv4(),
      entry.timeTrackable.getId(),
      Timestamp.now(),
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
