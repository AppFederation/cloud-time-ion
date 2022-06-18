import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { OryTreeNode } from '../../../tree-model/TreeModel'

export class NodeDebug {
  countApplyItemDataValuesToViews = 0
}

@Component({
  selector: 'app-node-debug-cell',
  templateUrl: './node-debug-cell.component.html',
  styleUrls: ['./node-debug-cell.component.sass']
})
export class NodeDebugCellComponent implements OnInit {

  @Input() treeNode: OryTreeNode

  @Input() nodeDebug: NodeDebug

  constructor() { }

  ngOnInit() {
  }

}
