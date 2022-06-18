import { Injectable } from '@angular/core';
import { TreeService } from '../tree-model/tree.service'
import { ItemId } from '../db/DbItem'
import { Observable } from 'rxjs'

export type DurationMs = number

class TimeRange {
  constructor(
    public start ? : Date,
    public end ? : Date,
  ) {
  }
}

/**
 * Calculate amount of time spent for given item (including/excluding sub-items), in given time ranges.
 *
 * Used for Moderation/Exercise/Consistency Time Trackers feature/sub-app
 *
 * time presets:
 * - current session/period
 * - today
 * - yesterday
 * - this week
 * - last week
 * - this month
 * - last month
 * - averages:
 *   - per day this week
 *   - per day this month
 *   - per week this year
 *   - per week all-time
 */
@Injectable({
  providedIn: 'root'
})
export class TimeTrackingPeriodsAggregatedService {

  constructor(
    private treeService: TreeService,
    private timeTrackingPeriodsService,
  ) {

  }

  getTimeSpent(itemId: ItemId, includeSubItems: boolean, timeRange: TimeRange)/*: Observable<DurationMs>*/ {
    // this.timeTrackingPeriodsService.getPeriods

  }
}
