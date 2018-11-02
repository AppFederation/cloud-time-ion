import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { OryTreeNode } from '../shared/TreeModel'
import { TreeHostComponent } from '../tree/tree-host/tree-host.component'

@Component({
  selector: 'app-nested-tree-node',
  templateUrl: './nested-tree-node.component.html',
  styleUrls: ['./nested-tree-node.component.scss']
})
export class NestedTreeNodeComponent implements OnInit {

  @Input()
  treeNode: OryTreeNode

  @Input()
  treeHost: TreeHostComponent

  constructor() { }

  ngOnInit() {
  }

}
