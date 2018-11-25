import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { OryTreeNode } from '../shared/TreeModel'
import { TreeHostComponent } from '../tree/tree-host/tree-host.component'
import { debugLog } from '../shared/firestore-tree.service'

@Component({
  selector: 'app-nested-tree-node',
  templateUrl: './nested-tree-node.component.html',
  styleUrls: ['./nested-tree-node.component.scss']
})
export class NestedTreeNodeComponent implements OnInit {

  alwaysExpanded = false

  @Input()
  treeNode: OryTreeNode

  @Input()
  treeHost: TreeHostComponent

  constructor() { }

  ngOnInit() {
  }

  toggleExpand(event) {
    debugLog('expand', event)
    this.treeNode.expansion.toggleExpansion(event.altKey)
  }

}
