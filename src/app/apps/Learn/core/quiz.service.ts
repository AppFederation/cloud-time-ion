import { Injectable } from '@angular/core';
import {LearnDoService} from './learn-do.service'
import {OdmTimestamp} from '../../../libs/AppFedShared/odm/OdmBackend'

import {minBy} from 'lodash'
// import {Observable} from 'rxjs/internal/Observable'
import {map} from 'rxjs/operators'
import {LearnItem, LearnItem$, Rating} from '../models/LearnItem'

import {Observable,of, from } from 'rxjs';

export class QuizOptions {
  dePrioritizeNewMaterial: boolean
  onlyWithQA: boolean
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(
    private learnDoService: LearnDoService,
  ) {
  }

  getNextItemForSelfRating$(quizOptions: QuizOptions): Observable<LearnItem$> {
    return this.learnDoService.localItems$.pipe(
      map((item$s: LearnItem$[]) => {
        if ( quizOptions.onlyWithQA ) {
          item$s = item$s.filter(item => item.currentVal.hasQAndA())
        }
        // console.log(`this.learnDoService.localItems$.pipe item$s`, item$s.length)
        return minBy(item$s,
          (item$: LearnItem$) => this.calculateWhenNextRepetitionMsEpoch(item$, quizOptions.dePrioritizeNewMaterial))
      })
    )
    // return of(this.learnDoService.getItem$ById(`LearnItem__2020-06-24__23.56.06.054Z_`))
  }

  calculateIntervalHours(rating: Rating) {
    // TODO: (right now the app is ok at relative priority/frequency, but necessarily too good at determining the exact time spacing
    // 0 => 1 min
    // 0.5 => few hours
    //
    // Ebbinghaus forgetting curve
    return 12 * Math.pow(2, rating || 0)
  }

  calculateWhenNextRepetitionMsEpoch(item$: LearnItem$, dePrioritizeNewMaterial: boolean) {
    // dePrioritizeNewMaterial = false
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
      (dePrioritizeNewMaterial ? null : item.whenAdded) // ||
      // item.whenCreated /* garbled by accidental patching of all items */

    // if ( item$.id === `02mW3hdwYRbxCZAVbrSD` /*&& whenLastTouched*/ ) {
    //   console.log(`whenLastTouched`, /*item, */whenLastTouched, item.whenLastSelfRated, item.whenAdded)
    // }
    if ( ! whenLastTouched ) {
      return dePrioritizeNewMaterial ? new Date(2199, 1, 1).getTime() : 0 // Date.now() + 365 * 24 * 3600 * 1000 : 0 // 1970
    }
    const ret = whenLastTouched.toMillis() + (1000 * 3600 * this.calculateIntervalHours(item.lastSelfRating || 0))
    // console.log('calculateWhenNextRepetitionMsEpoch', new Date(ret))
    return ret

    // TODO: could store this in DB, so that I can make faster firestore queries later, sort by next repetition time (although what if the algorithm changes...)
  }
}
