import { Component, OnInit } from '@angular/core';
import {
  TimeTrackedEntry,
  TimeTrackingService,
} from '../time-tracking.service'
import { NavigationService } from '../../core/navigation.service'
import { OryTreeNode } from '../../tree-model/TreeModel'
import { PlanExecutionService } from '../../plan-execution/plan-execution.service'
import { TimeTrackingPeriodsService } from '../time-tracking-periods.service'
import {TreeTable} from 'primeng/treetable'
import {TreeTableNode} from '../../tree-model/TreeTableNode'

@Component({
  selector: 'app-time-tracking-toolbar',
  templateUrl: './time-tracking-toolbar.component.html',
  styleUrls: ['./time-tracking-toolbar.component.sass']
})
export class TimeTrackingToolbarComponent implements OnInit {

  constructor(
    public timeTrackingService: TimeTrackingService,
    public navigationService: NavigationService,
    public planExecutionService: PlanExecutionService /* just to instantiate and later to track % */,
    public timeTrackingPeriodsService: TimeTrackingPeriodsService,
  ) {}

  ngOnInit() {
  }

  navigateTo(entry: TimeTrackedEntry) {
    const node = entry.timeTrackable as TreeTableNode
    node.navigateInto()
    this.navigationService.navigateToNodeLastChild(node)
    node.expansion.setExpanded(true, {recursive: false})
  }
}
