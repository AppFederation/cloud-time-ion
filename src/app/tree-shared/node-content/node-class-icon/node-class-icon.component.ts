import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { OryTreeNode } from '../../../tree-model/TreeModel'

@Component({
  selector: 'app-node-class-icon',
  templateUrl: './node-class-icon.component.html',
  styleUrls: ['./node-class-icon.component.sass']
})
export class NodeClassIconComponent implements OnInit {

  @Input() treeNode: OryTreeNode

  constructor() { }

  ngOnInit() {
  }

  /** TODO: move to NodeIconCellComponent */
  getIconName() {
    // return this.treeNode.dbItem.itemClass.iconName
    if ( this.treeNode.parent2.isDayPlan) {
      return 'settings_applications'
    }
    if ( this.treeNode.isDayPlan ) {
      return 'calendar_today'
    } else {
      return 'note'
    }
  }

}
