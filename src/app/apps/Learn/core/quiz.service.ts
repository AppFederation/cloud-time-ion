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
      map(item$s => {
        // console.log(`this.learnDoService.localItems$.pipe item$s`, item$s.length)
        return minBy(item$s, item => this.calculateWhenNextRepetitionMsEpoch(item))
      })
    )
    // console.log(`QuizService learnDoService.itemsCount()`, this.learnDoService.itemsCount())
    // return null
  }

  calculateIntervalHours(rating: Rating) {
    return 12 * Math.pow(2, rating)
  }

  calculateWhenNextRepetitionMsEpoch(item: LearnItem) {
    const whenLastTouched: OdmTimestamp =
      item.whenLastSelfRated ||
      item.whenLastModified ||
      item.whenAdded ||
      item.whenCreated
    if ( ! whenLastTouched ) {
      return 0 // 1970
    }
    return whenLastTouched.toMillis() + (1000 * 3600 * this.calculateIntervalHours(item.lastSelfRating || 0))
  }
}
