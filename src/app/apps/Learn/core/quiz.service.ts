import { Injectable } from '@angular/core';
import {LearnDoService} from './learn-do.service'
import {OdmTimestamp} from '../../../libs/AppFedShared/odm/OdmBackend'

import {minBy} from 'lodash'
// import * as _ from "lodash";
// import {Observable} from 'rxjs/internal/Observable'
import {map} from 'rxjs/operators'
import {LearnItem, Rating} from '../models/LearnItem'

import {Observable,of, from } from 'rxjs';
import {LearnItem$} from '../models/LearnItem$'
import {debugLog} from '../../../libs/AppFedShared/utils/log'
import {DurationMs, TimeMsEpoch} from '../../../libs/AppFedShared/utils/type-utils'

/* TODO units; rename to DurationMs or TimeDurationMs;
*   !!! actually this is used as hours, confusingly! WARNING! */
export type Duration = number



export interface QuizOptions {
  dePrioritizeNewMaterial: boolean
  onlyWithQA: boolean
}

export class QuizStatus {
  constructor(
    public itemsLeft: number,
    public nextItem$?: LearnItem$,
    public estimatedMsLeft?: DurationMs,
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(
    private learnDoService: LearnDoService,
  ) {
  }

  getQuizStatus$(quizOptions: QuizOptions): Observable<QuizStatus> {
    return this.learnDoService.localItems$.pipe(
      map((item$s: LearnItem$[]) => {
        if ( quizOptions.onlyWithQA ) {
          item$s = item$s.filter(item => item.currentVal ?. hasQAndA())
        }
        // filter remaining until now
        const nowMs: TimeMsEpoch = Date.now()
        const pendingItems: LearnItem$[] = item$s.filter(item$ => {
          const msEpochRepetition = this.calculateWhenNextRepetitionMsEpoch(item$, quizOptions.dePrioritizeNewMaterial)
          // if ( ! (typeof msEpochRepetition === 'number') ) {
          //   console
          //   return false
          // }
          return msEpochRepetition <= nowMs
        })
        /* TODO: performance: make util method countMatchingAndSummarizeAndReturnFirst to not allocate array and not traverse twice
           summarize - estimatedTimeLeft
         */
        const retStatus = new QuizStatus(
          pendingItems.length,
          minBy(pendingItems,
              (item$: LearnItem$) => this.calculateWhenNextRepetitionMsEpoch(item$, quizOptions.dePrioritizeNewMaterial))
          // pendingItems[0] /* TODO: ensure sorted or minBy */,
        )

        // if ( retStatus.itemsLeft ) {
        //   debugLog(`quiz: pendingItems`, retStatus.itemsLeft) // this logs a lot
        // }

        return retStatus

        // console.log(`this.learnDoService.localItems$.pipe item$s`, item$s.length)
        // return minBy(item$s,
        //   (item$: LearnItem$) => this.calculateWhenNextRepetitionMsEpoch(item$, quizOptions.dePrioritizeNewMaterial))
      })
    )
    // return of(this.learnDoService.getItem$ById(`LearnItem__2020-06-24__23.56.06.054Z_`))
  }


  calculateIntervalHours(rating: Rating): Duration {

    // TODO: consider a kind of LIFO to prioritize minute periods (for them to not be at mercy of smth delayed from days ago); Coz the difference between 1 minute and say 10 hours is much bigger than 10 hours and 11 hours
    // TODO: (right now the app is ok at relative priority/frequency, but necessarily too good at determining the exact time spacing
    // 0 => 1 min
    // 0.5 => few hours
    //
    // Ebbinghaus forgetting curve
    // TODO: !!!! when rating zero, make it one minute (as in Anki), so that it goes in front of whatever stuff might have been there from previous days
    if ( rating === 0 ) {
      return 30/3600 // 30 seconds (could try 1 minute)
    }

    return 12 * Math.pow(2, rating || 0)
  }

  /** This could be a method of LearnItem$ */
  calculateWhenNextRepetitionMsEpoch(item$: LearnItem$ | null | undefined, dePrioritizeNewMaterial: boolean): TimeMsEpoch {
    // TODO: extract into strategy pattern class LearnAlgorithm or RepetitionAlgorithm
    // dePrioritizeNewMaterial = false
    // return item$.currentVal.whenAdded.toMillis()
    if ( ! item$ ) {
      return 0
    }
    const item = item$.currentVal
    if ( ! item ) {
      return 0
    }
    const whenLastTouched: OdmTimestamp | null =
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
