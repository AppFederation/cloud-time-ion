import {Component, Input, OnInit} from '@angular/core';
import {OdmTreeNode} from '../tree-node/OdmTreeNode'
import {GenericItem$} from '../GenericItem$'
import {GenericItemsService} from '../generic-items.service'
import {LearnItemItemsService} from '../../../../apps/Learn/core/learn-item-items.service'
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

  rootNode!: OdmTreeNode<LearnItem$>

  constructor(
    // public itemsService: GenericItemsService
    public itemsService: LearnItemItemsService
  ) { }

  ngOnInit() {
    this.rootItem ??= this.itemsService.treeRootItem
    this.rootNode = new OdmTreeNode(undefined, this.rootItem /* hack */)
  }

}
