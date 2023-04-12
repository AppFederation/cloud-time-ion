import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { debugLog } from '../../../utils/log'
import {ApfBaseTreeNode} from '../../../tree-model/TreeModel'
import {RootTreeNode} from '../../../tree-model/RootTreeNode'

@Component({
  selector: 'app-node-expansion-icon',
  templateUrl: './node-expansion-icon.component.html',
  styleUrls: ['./node-expansion-icon.component.sass']
})
export class NodeExpansionIconComponent implements OnInit {

  @Input() treeNode!: RootTreeNode<any>

  constructor() { }

  ngOnInit() {
  }

  toggleExpand(event: any) {
    debugLog('toggleExpand', event)
    this.treeNode.expansion.setExpanded(! this.treeNode.expanded, event.altKey)
  }

  onPress(event: any) {
    debugLog('onPress', event)
    this.treeNode.expansion.toggleExpansion(true)
  }

}
