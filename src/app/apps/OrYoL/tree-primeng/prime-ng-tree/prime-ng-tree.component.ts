import {Component, Input, OnInit} from '@angular/core';
import {TreeModel} from '../../tree-model/TreeModel'
import {TreeHostComponent} from '../../tree-host/tree-host/tree-host.component'

@Component({
  selector: 'app-prime-ng-tree',
  templateUrl: './prime-ng-tree.component.html',
  styleUrls: ['./prime-ng-tree.component.scss']
})
export class PrimeNgTreeComponent implements OnInit {

  @Input()
  treeModel!: TreeModel<any>

  @Input()
  treeHost!: TreeHostComponent

  constructor() { }

  ngOnInit() {
  }

  nodeDrop(event: any) {
    console.log('nodeDrop', event)
    // this.dbService.moveNode(event.dragNode.dbId, event.dropNode.dbId) // FIXME
  }

}
