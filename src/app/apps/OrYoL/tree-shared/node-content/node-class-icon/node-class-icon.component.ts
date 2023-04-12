import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {OryBaseTreeNode} from '../../../tree-model/RootTreeNode'

@Component({
  selector: 'app-node-class-icon',
  templateUrl: './node-class-icon.component.html',
  styleUrls: ['./node-class-icon.component.sass']
})
export class NodeClassIconComponent implements OnInit {

  @Input() treeNode!: OryBaseTreeNode

  constructor() { }

  ngOnInit() {
  }

  /** TODO: move to NodeIconCellComponent */
  getIconName() {
    // return this.treeNode.dbItem.itemClass.iconName
    if ( this.treeNode.content.isTask) {
      return 'settings_applications'
    } else if ( this.treeNode.isChildOfRoot ) {
      return 'folder'
    } else if ( this.treeNode.content.isDayPlan ) {
      return 'calendar_today'
    } else if ( this.treeNode.content.isMilestone ) {
      return 'event_note'
    } else if ( this.treeNode.content.isJournalEntry ) {
      return 'edit'
    } else {
      return 'note'
    }
  }

}
