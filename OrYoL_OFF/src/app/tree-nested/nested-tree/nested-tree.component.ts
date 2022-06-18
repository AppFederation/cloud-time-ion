import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  OryTreeNode,
  TreeModel,
} from '../../tree-model/TreeModel'
import { TreeHostComponent } from '../../tree-host/tree-host/tree-host.component'

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

  wrapperHackArrayWasForNode: OryTreeNode
  /* For forcing new component instance every time visualRoot changes */
  wrapperHackArray

  constructor() {
  }

  ngOnInit() {
    this.treeModel.navigation.visualRoot$.subscribe(() => {
      this.createTreeNodeWrapperHackArrayIfNecessary()
    })
  }

  /* For forcing new component instance every time visualRoot changes */
  createTreeNodeWrapperHackArrayIfNecessary() {
    const visualRoot = this.treeModel.navigation.visualRoot
    if ( this.wrapperHackArrayWasForNode !== visualRoot ) {
      this.wrapperHackArray = [
        {wrapperHack: visualRoot}
      ]
    }
    return this.wrapperHackArray
  }
}
