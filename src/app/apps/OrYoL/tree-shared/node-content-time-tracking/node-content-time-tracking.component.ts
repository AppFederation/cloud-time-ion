import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  TimeTrackingService,
} from '../../time-tracking/time-tracking.service'

import {OryBaseTreeNode} from '../../tree-model/TreeModel'
import {TimeTrackedEntry} from '../../time-tracking/TimeTrackedEntry'

@Component({
  selector: 'app-node-content-time-tracking',
  templateUrl: './node-content-time-tracking.component.html',
  styleUrls: ['./node-content-time-tracking.component.scss']
})
export class NodeContentTimeTrackingComponent implements OnInit {

  @Input() treeNode!: OryBaseTreeNode

  timeTrackedEntry!: TimeTrackedEntry

  constructor(
    public timeTrackingService: TimeTrackingService,
  ) { }

  ngOnInit() {
    this.timeTrackedEntry = this.timeTrackingService.obtainEntryForItem(this.treeNode.content.dbItem)
  }

}
