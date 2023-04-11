import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  date,
  TimeTrackingService,
} from '../../../time-tracking/time-tracking.service'
import { OryTreeNode } from '../../../tree-model/TreeModel'
import {TreeTableNode} from '../../../tree-model/TreeTableNode'

function timeTrackedMsFunc ( node: OryTreeNode ) {
  return ((node.itemData && node.itemData.timeTrack && node.itemData.timeTrack.previousTrackingsMs) || 0) +
    ((node.itemData && node.itemData.timeTrack && node.itemData.timeTrack.nowTrackingSince) ? (
    Date.now() - date(node.itemData.timeTrack.nowTrackingSince).getTime()
  ) : 0)
}

@Component({
  selector: 'app-time-tracking-menu',
  templateUrl: './time-tracking-menu.component.html',
  styleUrls: ['./time-tracking-menu.component.scss']
})
export class TimeTrackingMenuComponent implements OnInit {

  @Input() treeNode!: TreeTableNode

  timeTrackedMsFunc = timeTrackedMsFunc

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


