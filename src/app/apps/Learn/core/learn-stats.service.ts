import { Injectable } from '@angular/core';
import {countBy} from 'lodash'
import {LearnItem, LearnItem$} from '../models/LearnItem'
import {countNotNullishBy} from '../../../libs/AppFedShared/utils/utils'
import {Dictionary} from '../../../libs/AppFedShared/utils/dictionary-utils'
import {LearnDoService} from './learn-do.service'
import {map} from 'rxjs/operators'
import {Observable} from 'rxjs/internal/Observable'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'

/** split into part that goes into DB */
export class LearnStats {
  countWithRatingPresent?: number = 0
  atLeast05? = 0
  atLeast1? = 0
  atLeast1_5? = 0
  atLeast2? = 0
  countWithRatingEqual?: Dictionary<number> = {}
  countWithRatingEqualOrHigher?: Dictionary<number> = {}
}

@Injectable({
  providedIn: 'root'
})
export class LearnStatsService {

  stats$: Observable<LearnStats | undefined> = this.learnDoService.localItems$.pipe(
    map((item$s: (LearnItem$[] | undefined)) => {
      if ( ! item$s ) {
        return undefined
      }
      const items: (LearnItem|undefined|null)[] = item$s.map(item$ => item$.currentVal)
      return {
        countWithRatingEqual: countBy(items, (item: LearnItem) => item ?. lastSelfRating),
        countWithRatingPresent: countNotNullishBy(items, item => item ?. lastSelfRating),
        atLeast05: items ?. filter((item: LearnItem | nullish) => (item ?. lastSelfRating ?? 0) >= 0.5) ?. length,
        atLeast1: items ?. filter((item: LearnItem | nullish) => (item ?. lastSelfRating ?? 0) >= 1) ?. length,
        atLeast1_5: items ?. filter((item: LearnItem | nullish) => (item ?. lastSelfRating ?? 0) >= 1.5) ?. length,
        atLeast2: items ?. filter((item: LearnItem | nullish) => (item ?. lastSelfRating ?? 0) >= 2) ?. length,
      }
    })
  )

  constructor(
    private learnDoService: LearnDoService,
  ) {

  }

}
