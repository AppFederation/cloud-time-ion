
import { Injectable } from '@angular/core';
import {ReplaySubject} from 'rxjs'
import {CachedSubject} from '../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {Router} from '@angular/router'
import {minutesAsMs} from '../../libs/AppFedShared/utils/time/date-time-utils'
import {ignorePromise} from '../../libs/AppFedShared/utils/promiseUtils'


export class MindfulnessOptions {
  // timePerDay: DurationDistribution = 3
  // timesPerDay: DurationDistribution = 3

  // timePerWeek
  // notificationOptions: {
  //    leniency...
  //    sound:
  // }
}

/**
 * This will have a lot in common with QuizService
 * - picking the most-old-pending, by importance,
 * - except the intervals might be fixed
 * - there might be fixed times, e.g. for routines, meditation (e.g. time ranges, like do exercises between 1pm and 2pm)
 * - - note: for the fixed times, maybe better to use calendar [for now]
 * - - - but
 * - it might even consult next quiz item and e.g. determine if it's more important than e.g. mindfulness
 * - automatic mode: could be bound to quiz's "Apply & Next" button
 * */
@Injectable({
  providedIn: 'root'
})
export class WhatNextService {

  whatToDoNextUrl$ = new CachedSubject(`/what-next`)

  whenLastMindfulness: Date | undefined

  constructor(
    private router: Router,
  ) {
    console.log(`WhatNextService service constructor`)
  }

  whatNext() {
    const intervalMs = minutesAsMs(20)
    // const intervalMs = 20 * 1000
    if ( ! this.whenLastMindfulness
        || (Date.now() - this.whenLastMindfulness.getTime()) > intervalMs
    ) {
      this.whenLastMindfulness = new Date()
      ignorePromise(this.router.navigateByUrl('/mindfulness'))
      console.log(`this.router.navigateByUrl('/mindfulness')`)
    } else {
      const h = new Date().getHours()
      console.log('hours', h)
      if ( h >= 2 && h <= 11 ) {
        ignorePromise(this.router.navigateByUrl('/sleep'))
      }
    }
  }
}
