import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  TimeTrackedEntry,
  TimeTrackingService,
} from '../../time-tracking/time-tracking.service'
import {OryBaseTreeNode} from '../../tree-model/RootTreeNode'

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
    this.timeTrackedEntry = this.timeTrackingService.obtainEntryForItem(this.treeNode.content)
  }

}
