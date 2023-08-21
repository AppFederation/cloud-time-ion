import {Component, Input, OnInit} from '@angular/core';
import {TreeNode} from '../tree-node/TreeNode'
import {GenericItem$} from '../GenericItem$'
import {GenericItemsService} from '../generic-items.service'
import {LearnDoService} from '../../../../apps/Learn/core/learn-do.service'
import {LearnItem$} from '../../../../apps/Learn/models/LearnItem$'

@Component({
  selector: 'app-tree',
  templateUrl: './odm-tree.component.html',
  styleUrls: ['./tree.component.sass'],
})
export class OdmTreeComponent implements OnInit {


  @Input()
  // rootItem!: GenericItem$
  rootItem!: LearnItem$

  // TODO: use TreeModel

  rootNode!: TreeNode<LearnItem$>

  constructor(
    // public itemsService: GenericItemsService
    public itemsService: LearnDoService
  ) { }

  ngOnInit() {
    this.rootItem ??= this.itemsService.treeRootItem
    this.rootNode = new TreeNode(undefined, this.rootItem /* hack */)
  }

}
