import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  date,
  TimeTrackingService,
} from '../../../time-tracking/time-tracking.service'
import {ApfBaseTreeNode, OryBaseTreeNode} from '../../../tree-model/TreeModel'

function timeTrackedMsFunc ( node: ApfBaseTreeNode ) {
  const itemData = node.content.itemData
  return ((itemData && itemData.timeTrack && itemData.timeTrack.previousTrackingsMs) || 0) +
    ((itemData && itemData.timeTrack && itemData.timeTrack.nowTrackingSince) ? (
    Date.now() - date(itemData.timeTrack.nowTrackingSince).getTime()
  ) : 0)
}

@Component({
  selector: 'app-time-tracking-menu',
  templateUrl: './time-tracking-menu.component.html',
  styleUrls: ['./time-tracking-menu.component.scss']
})
export class TimeTrackingMenuComponent implements OnInit {

  @Input() treeNode!: OryBaseTreeNode

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


