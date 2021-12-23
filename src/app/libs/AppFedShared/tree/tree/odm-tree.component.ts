import { Component, OnInit } from '@angular/core';
import {TreeNode} from '../tree-node/TreeNode'

@Component({
  selector: 'app-tree',
  templateUrl: './odm-tree.component.html',
  styleUrls: ['./tree.component.sass'],
})
export class OdmTreeComponent implements OnInit {

  rootItem = undefined as any

  rootNode = new TreeNode(undefined, this.rootItem /* hack */)

  constructor() { }

  ngOnInit() {}

}
