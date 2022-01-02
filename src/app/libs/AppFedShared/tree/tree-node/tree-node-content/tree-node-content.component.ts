import {Component, Input, OnInit} from '@angular/core';
import {OdmCell} from '../../cells/OdmCell'
import {TreeNode} from '../TreeNode'

@Component({
  selector: 'app-tree-node-content',
  templateUrl: './tree-node-content.component.html',
  styleUrls: ['./tree-node-content.component.sass'],
})
export class TreeNodeContentComponent implements OnInit {

  @Input()
  treeNode !: TreeNode

  titleCell !: OdmCell

  constructor() { }

  ngOnInit() {
    this.titleCell = new OdmCell(this.treeNode)
  }

}
