import {Component, Input, OnInit} from '@angular/core';
import {TreeNode} from './TreeNode'
import {GenericItem$} from '../GenericItem$'
import {OdmItem$2} from '../../odm/OdmItem$2'
import {OdmService2} from '../../odm/OdmService2'

@Component({
  selector: 'app-tree-node',
  templateUrl: './odm-tree-node.component.html',
  styleUrls: ['./odm-tree-node.component.css']
})
export class OdmTreeNodeComponent implements OnInit {

  expanded = false

  @Input()
  treeNode!: TreeNode<OdmItem$2<any, any, any, any>>

  constructor() { }

  ngOnInit(): void {
    this.treeNode.requestLoadChildren()
  }

  addChild() {
    const item$ = this.treeNode.item$
    const odmService = item$.odmService as OdmService2<any, any, any, any>
    odmService.newItem(undefined, undefined, [item$])
  }
}
