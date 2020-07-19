import { Injectable } from '@angular/core';
import {countBy} from 'lodash'
import {LearnItem, LearnItem$} from '../models/LearnItem'
import {countNotNullishBy} from '../../../libs/AppFedShared/utils/utils'
import {Dictionary} from '../../../libs/AppFedShared/utils/dictionary-utils'
import {LearnDoService} from './learn-do.service'
import {map} from 'rxjs/operators'
import {Observable} from 'rxjs/internal/Observable'

export class LearnStats {
  countWithRatingPresent?: number = 0
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
      }
    })
  )

  constructor(
    private learnDoService: LearnDoService,
  ) {

  }

}
