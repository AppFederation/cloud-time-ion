import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TreeModel } from '../shared/TreeModel'
import { TreeHostComponent } from '../tree/tree-host/tree-host.component'

@Component({
  selector: 'app-nested-tree',
  templateUrl: './nested-tree.component.html',
  styleUrls: ['./nested-tree.component.scss']
})
export class NestedTreeComponent implements OnInit {

  @Input()
  treeModel: TreeModel

  @Input()
  treeHost: TreeHostComponent

  constructor() { }

  ngOnInit() {
  }

}
