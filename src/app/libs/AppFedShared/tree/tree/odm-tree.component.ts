import { Component, OnInit } from '@angular/core';
import {TreeNode} from '../tree-node/TreeNode'
import {GenericItem$} from '../GenericItem$'
import {GenericItemsService} from '../generic-items.service'

@Component({
  selector: 'app-tree',
  templateUrl: './odm-tree.component.html',
  styleUrls: ['./tree.component.sass'],
})
export class OdmTreeComponent implements OnInit {


  rootItem = new GenericItem$(this.itemsService, '_root_item_')

  // TODO: use TreeModel

  rootNode = new TreeNode(undefined, this.rootItem /* hack */)

  constructor(
    public itemsService: GenericItemsService
  ) { }

  ngOnInit() {}

}
