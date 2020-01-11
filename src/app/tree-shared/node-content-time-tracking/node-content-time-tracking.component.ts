import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  TimeTrackedEntry,
  TimeTrackingService,
} from '../../time-tracking/time-tracking.service'
import { OryTreeNode } from '../../tree-model/TreeModel'

@Component({
  selector: 'app-node-content-time-tracking',
  templateUrl: './node-content-time-tracking.component.html',
  styleUrls: ['./node-content-time-tracking.component.scss']
})
export class NodeContentTimeTrackingComponent implements OnInit {

  @Input() treeNode: OryTreeNode

  timeTrackedEntry: TimeTrackedEntry

  constructor(
    public timeTrackingService: TimeTrackingService,
  ) { }

  ngOnInit() {
    this.timeTrackedEntry = TimeTrackedEntry.of(this.treeNode)
  }

}
