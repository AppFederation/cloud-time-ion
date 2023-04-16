import { Component, OnInit } from '@angular/core';
import {
  TimeTrackingService,
} from '../time-tracking.service'
import { NavigationService } from '../../core/navigation.service'
import { PlanExecutionService } from '../../plan-execution/plan-execution.service'
import { TimeTrackingPeriodsService } from '../time-tracking-periods.service'

import {DbTreeService} from '../../tree-model/db-tree-service'
import {TimeTrackedEntry} from '../TimeTrackedEntry'
import {CachedSubject} from '../../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {Observable} from 'rxjs/internal/Observable'

@Component({
  selector: 'app-time-tracking-toolbar',
  templateUrl: './time-tracking-toolbar.component.html',
  styleUrls: ['./time-tracking-toolbar.component.sass']
})
export class TimeTrackingToolbarComponent implements OnInit {

  timeTrackedEntries$: Observable<TimeTrackedEntry[]> = this.timeTrackingService.toolbarEntries$

  constructor(
    public timeTrackingService: TimeTrackingService,
    public treeService: DbTreeService,
    public navigationService: NavigationService,
    public planExecutionService: PlanExecutionService /* just to instantiate and later to track % */,
    public timeTrackingPeriodsService: TimeTrackingPeriodsService,
  ) {}

  ngOnInit() {
  }

  navigateTo(entry: TimeTrackedEntry) {
    const itemId = entry.timeTrackable
    // node.navigateInto()
    // this.navigationService.navigateToNodeLastChild(node)
    this.navigationService.navigateToNodeByItemId(entry.timeTrackable.getId())
  }
}
