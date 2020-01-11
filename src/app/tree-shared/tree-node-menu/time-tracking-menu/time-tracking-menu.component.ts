import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TimeTrackingService } from '../../../time-tracking/time-tracking.service'
import { OryTreeNode } from '../../../tree-model/TreeModel'

@Component({
  selector: 'app-time-tracking-menu',
  templateUrl: './time-tracking-menu.component.html',
  styleUrls: ['./time-tracking-menu.component.scss']
})
export class TimeTrackingMenuComponent implements OnInit {

  @Input() treeNode: OryTreeNode

  // get isTimeTrackingThis() { return this.timeTrackingService.isTimeTracking(this.timeTrackable) }
  get timeTrackable() { return this.treeNode.itemId }

  constructor(
    public timeTrackingService: TimeTrackingService,
  ) { }

  ngOnInit() {
  }

  startTimeTracking() {
    // this.timeTrackingService.startTimeTrackingOf(this.timeTrackable)
  }

  stopTimeTracking() {
    // this.timeTrackingService.stopTimeTrackingOf(this.timeTrackable)
  }

}


