import {Component, Input, OnInit} from '@angular/core';
import {TreeNode} from './TreeNode'

@Component({
  selector: 'app-tree-node',
  templateUrl: './odm-tree-node.component.html',
  styleUrls: ['./odm-tree-node.component.css']
})
export class OdmTreeNodeComponent implements OnInit {

  expanded = false

  @Input()
  treeNode!: TreeNode<any>

  constructor() { }

  ngOnInit(): void {
    this.treeNode.requestLoadChildren()
  }

}
