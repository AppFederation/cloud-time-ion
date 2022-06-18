import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { OryTreeNode } from '../../../tree-model/TreeModel'
import { debugLog } from '../../../utils/log'

@Component({
  selector: 'app-node-expansion-icon',
  templateUrl: './node-expansion-icon.component.html',
  styleUrls: ['./node-expansion-icon.component.sass']
})
export class NodeExpansionIconComponent implements OnInit {

  @Input() treeNode!: OryTreeNode

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
