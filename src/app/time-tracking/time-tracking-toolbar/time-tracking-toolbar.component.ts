import { Component, OnInit } from '@angular/core';
import { TimeTrackingService } from '../time-tracking.service'
import { NavigationService } from '../../core/navigation.service'
import { OryTreeNode } from '../../tree-model/TreeModel'

@Component({
  selector: 'app-time-tracking-toolbar',
  templateUrl: './time-tracking-toolbar.component.html',
  styleUrls: ['./time-tracking-toolbar.component.sass']
})
export class TimeTrackingToolbarComponent implements OnInit {

  constructor(
    public timeTrackingService: TimeTrackingService,
    public navigationService: NavigationService,
  ) {}

  ngOnInit() {
  }

  navigateTo() {
    const node = this.timeTrackingService.currentEntry.timeTrackable as OryTreeNode
    this.navigationService.navigateToNodeLastChild(node)
    node.expansion.setExpanded(true, {recursive: false})
  }
}
