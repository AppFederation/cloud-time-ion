import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { OryTreeNode } from '../shared/TreeModel'
import { TreeHostComponent } from '../tree/tree-host/tree-host.component'
import { debugLog } from '../shared/log'

@Component({
  selector: 'app-nested-tree-node',
  templateUrl: './nested-tree-node.component.html',
  styleUrls: ['./nested-tree-node.component.scss']
})
export class NestedTreeNodeComponent implements OnInit {

  alwaysExpanded = false

  isVisualRoot: boolean

  @Input()
  treeNode: OryTreeNode

  /* Hack to force new instance of component for input changes*/
  @Input()
  treeNodeWrapperHack: {wrapperHack: OryTreeNode}


  @Input()
  treeHost: TreeHostComponent

  constructor() {
  }

  ngOnInit() {
    if (this.treeNodeWrapperHack) {
      this.treeNode = this.treeNodeWrapperHack.wrapperHack
    }
    this.isVisualRoot = this.treeNode.isVisualRoot
  }

  toggleExpand(event) {
    debugLog('expand', event)
    this.treeNode.expansion.toggleExpansion(event.altKey)
  }

}
