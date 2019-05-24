import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TimeTrackingService } from '../../time-tracking/time-tracking.service'
import { OryTreeNode } from '../../tree-model/TreeModel'

@Component({
  selector: 'app-node-content-time-tracking',
  templateUrl: './node-content-time-tracking.component.html',
  styleUrls: ['./node-content-time-tracking.component.scss']
})
export class NodeContentTimeTrackingComponent implements OnInit {

  @Input() treeNode: OryTreeNode

  constructor(
    public timeTrackingService: TimeTrackingService,
  ) { }

  ngOnInit() {
  }

}
