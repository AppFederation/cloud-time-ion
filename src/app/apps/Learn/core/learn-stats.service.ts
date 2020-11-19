import { Injectable } from '@angular/core';
import {countBy, flatten, isEqual} from 'lodash-es'
import {LearnItem} from '../models/LearnItem'
import {countBy2, countNotNullishBy} from '../../../libs/AppFedShared/utils/utils'
import {Dictionary, mapEntriesToArray} from '../../../libs/AppFedShared/utils/dictionary-utils'
import {LearnDoService} from './learn-do.service'
import {distinctUntilChanged, filter, map, tap} from 'rxjs/operators'
import {Observable} from 'rxjs'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {LearnItem$} from '../models/LearnItem$'
import {throttleTimeWithLeadingTrailing_ReallyThrottle} from '../../../libs/AppFedShared/utils/rxUtils'
import {minutesAsMs, secondsAsMs} from '../../../libs/AppFedShared/utils/time/time-utils'
import {debugLog, errorAlert} from '../../../libs/AppFedShared/utils/log'
import {StatsHistoryService} from './stats-history.service'
import {countByMulti} from '../../../libs/AppFedShared/utils/lodashPlus/countByMulti'
import {Accessor, getByAccessor} from '../../../libs/AppFedShared/utils/lodashPlus/getByAccessor'

/** split into part that goes into DB */
export class LearnStats {
  countWithRatingPresent?: number = 0
  atLeast05? = 0
  atLeast1? = 0
  atLeast1_5? = 0
  atLeast2? = 0
  /** to be stored in stats history */
  countWithRatingEqual?: Dictionary<number> = {}
  countWithRatingEqualOrHigher?: Dictionary<number> = {}
  countWithQA: number = 0
  countWithAudio: number = 0
}

export class StoredLearnStats {
  /* equivalent to countWithRatingEqual */
  countByRating ? : Dictionary<number> = {}
  countWithQA ? : number
  countWithAudio ? : number
  countByDimsFieldIds ? : string[]
  countByDims ? : any
  countByDimsRows ? : any
}

export type NamedAccessor = [string, Accessor<LearnItem$, any>]

const udf = ''

/** Keep in mind: Firestore limits to 10 (20?) levels --- https://firebase.google.com/docs/firestore/quotas
 * TODO: isDone */
const accessorsFields: Array<NamedAccessor> = [
  ['isTask', item$ => item$.val?.isTask ?? udf],
  ['importance', item$ => item$.getEffectiveImportanceShortId()] /* TODO: abbrev; if I have smth like VHImp, VHFun, I could have it non-ambiguous
                should this be effective value?
                TODO + status
                TODO + categories
                TODO the extended stats might be added e.g. daily
             */,
  ['fun', item$ => item$.getEffectiveFunShortId()],
  ['mental', item$ => item$.getEffectiveMentalLevelShortId()],
  ['selfRating', item$ => (item$.val?.lastSelfRating ?? udf) ?? udf],
  ['estMinutes', item$ => (item$.val?.getDurationEstimateMinutes() ?? udf)],
  ['hasQA', item$ => item$.val?.hasQAndA() ?? udf],
  ['hasAudio', item$ => item$.val?.hasAudio ?? udf],
  // ['roi', item$ => item$.getEffectiveRoi() + '_Roi'],
  // () => 'fakeLong',
]

const accessorsFieldsIds: string[] = accessorsFields.map(acc => acc[0])


@Injectable({
  providedIn: 'root'
})
export class LearnStatsService {

  stats$: Observable<LearnStats | undefined> = this.learnDoService.localItems$.pipe(
    map((item$s: (LearnItem$[] | undefined)) => {
      if ( ! item$s ) {
        return undefined
      }
      const count = item$s ?. length
      if ( count >= 3400 * 2 ) {
        errorAlert(`item$s ?. length - items probably duplicated; bug`, item$s ?. length)
      }
      const items: (LearnItem|undefined|null)[] = item$s.map(item$ => item$.currentVal)
      return {
        countWithRatingEqual: this.getCountWithRatingEqual(items),
        countWithRatingPresent: countNotNullishBy(items, item => item ?. lastSelfRating),
        atLeast05: items ?. filter((item: LearnItem | nullish) => (item ?. lastSelfRating ?? 0) >= 0.5) ?. length,
        atLeast1: items ?. filter((item: LearnItem | nullish) => (item ?. lastSelfRating ?? 0) >= 1) ?. length,
        atLeast1_5: items ?. filter((item: LearnItem | nullish) => (item ?. lastSelfRating ?? 0) >= 1.5) ?. length,
        atLeast2: items ?. filter((item: LearnItem | nullish) => (item ?. lastSelfRating ?? 0) >= 2) ?. length,
        countWithQA: countBy2(item$s, item$ => !! item$.val?.hasQAndA()) /* FIXME duplicate */,
        countWithAudio: countBy2(item$s, item$ => !! item$.val?.hasAudio) /* FIXME duplicate */,
      }
    })
  )

  private getCountWithRatingEqual(items: (LearnItem | undefined | null)[]) {
    return countBy(items, (item: LearnItem) => item?.lastSelfRating)
  }

  constructor(
    private learnDoService: LearnDoService,
    private statsHistoryService: StatsHistoryService,
  ) {
    // debugLog(`statsToSave init`)

    /*const statsToSave$: Observable<StoredLearnStats> = */this.learnDoService.localItems$.pipe(
      throttleTimeWithLeadingTrailing_ReallyThrottle(minutesAsMs(2/*10*//*0.0001*/)),
      filter(item$s => {
        return ! ! item$s?.length; // skip the initial val that appears before data is loaded
      }),
      map(item$s => {
        return this.makeStatsFromItems(item$s)
      }),
      distinctUntilChanged((stats1, stats2) => {
        const equal = isEqual(stats1, stats2)
        // TODO: measure time somewhere here, coz hanging on mobile.
        // debugLog(`statsToSave$ isEqual`, equal, stats1, stats2)
        return equal
      }),
      tap(stats => {
        debugLog(`statsToSave$`)
        if ( stats ) {
          this.statsHistoryService.newValue(stats)
        }
      })
    ).subscribe(() => {})
  }

  private makeStatsFromItems(item$s: LearnItem$[] | nullish) {
    if ( ! item$s ?. length ) {
      return
    }
    let multiDimRowsFlattened: any[] = []
    try {
      multiDimRowsFlattened = flatten(this.makeMultiDimRows(item$s))
      debugLog(`multiDimRowsFlattened json len`, JSON.stringify(multiDimRowsFlattened).length)
    } catch (e) {
      errorAlert(`makeMultiDimRows error`, e)
    }
    let countByDims = {}
    try {
      // https://en.wikipedia.org/wiki/OLAP_cube
      // Firestore Maximum depth of fields in a map or array	20 - https://firebase.google.com/docs/firestore/quotas
      // countByDims = countByMulti(item$s, accessorsFields)
    } catch (e) {
      errorAlert(`countByDims error`, e)
    }
    const ret: StoredLearnStats = {
      countByRating: this.getCountWithRatingEqual(item$s.map(item$ => item$.currentVal)),
      countWithQA: countBy2(item$s, item$ => !!item$.val?.hasQAndA()),
      countWithAudio: countBy2(item$s, item$ => !!item$.val?.hasAudio),
      countByDimsFieldIds: accessorsFieldsIds,
      // countByDims,
      countByDimsRows: multiDimRowsFlattened
    }
    return ret
  }

  saveStatsFromItemsNow() {
    debugLog(`saveStatsFromItemsNow`)
    const item$s = this.learnDoService.localItems$.lastVal
    if ( item$s ?. length ) {
      const stats = this.makeStatsFromItems(item$s)
      if ( stats ) {
        this.statsHistoryService.newValue(stats)
      }
    }
  }

  private makeMultiDimRows(item$s: LearnItem$[]): Array<any[]> {
    const countsDict = countBy(item$s, (item$) => {
      return JSON.stringify(accessorsFields.map(acc => {
        return getByAccessor(item$, acc[1])
      }))
    })
    const ret = mapEntriesToArray(countsDict, entry => [ ...JSON.parse(entry[0]), entry[1]
      /* count is last, to not disrupt the order between values and array of keys */])

    // console.log(`makeMultiDimRows json length: `, JSON.stringify(ret).length)
    return ret
  }
}
