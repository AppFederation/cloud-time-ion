import { Injectable } from '@angular/core';
import {LearnDoService} from './learn-do.service'
import {OdmTimestamp} from '../../../libs/AppFedShared/odm/OdmBackend'

import {minBy} from 'lodash'
import {Observable} from 'rxjs/internal/Observable'
import {map} from 'rxjs/operators'
import {LearnItem, LearnItem$, Rating} from '../models/LearnItem'

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(
    private learnDoService: LearnDoService,
  ) {
    console.log(`QuizService learnDoService.itemsCount()`, this.learnDoService.itemsCount())
  }

  getNextItemForSelfRating$(): Observable<LearnItem$> {
    return this.learnDoService.localItems$.pipe(
      map((item$s: LearnItem$[]) => {
        // console.log(`this.learnDoService.localItems$.pipe item$s`, item$s.length)
        return minBy(item$s, (item$: LearnItem$) => this.calculateWhenNextRepetitionMsEpoch(item$))
      })
    )
    // console.log(`QuizService learnDoService.itemsCount()`, this.learnDoService.itemsCount())
    // return null
  }

  calculateIntervalHours(rating: Rating) {
    return 12 * Math.pow(2, rating || 0)
  }

  calculateWhenNextRepetitionMsEpoch(item$: LearnItem$) {
    // return item$.currentVal.whenAdded.toMillis()
    if ( ! item$ ) {
      return 0
    }
    const item = item$.currentVal
    if ( ! item ) {
      return 0
    }
    const whenLastTouched: OdmTimestamp =
      item.whenLastSelfRated ||
      // item.whenLastModified || /* garbled by accidental patching of all items */
      item.whenAdded // ||
      // item.whenCreated /* garbled by accidental patching of all items */
    if ( ! whenLastTouched ) {
      return 0 // 1970
    }
    const ret = whenLastTouched.toMillis() + (1000 * 3600 * this.calculateIntervalHours(item.lastSelfRating || 0))
    // console.log('calculateWhenNextRepetitionMsEpoch', new Date(ret))
    return ret
  }
}
