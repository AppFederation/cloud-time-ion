
import { Injectable } from '@angular/core';
import {ReplaySubject} from 'rxjs'
import {CachedSubject} from '../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'


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
export class SchedulerService {

  whatToDoNextUrl$ = new CachedSubject(`/what-next`)

  constructor() { }
}
