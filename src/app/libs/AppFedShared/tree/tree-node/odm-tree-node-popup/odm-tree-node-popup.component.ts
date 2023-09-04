import {Component, Input, OnInit} from '@angular/core';
import {OdmTreeNode} from '../OdmTreeNode'
import {OdmService2} from '../../../odm/OdmService2'
import {LearnItem} from '../../../../../apps/Learn/models/LearnItem'
import {LearnItem$} from '../../../../../apps/Learn/models/LearnItem$'
import {stripHtml} from '../../../utils/html-utils'

@Component({
  selector: 'app-odm-tree-node-popup',
  templateUrl: './odm-tree-node-popup.component.html',
  styleUrls: ['./odm-tree-node-popup.component.scss'],
})
export class OdmTreeNodePopupComponent implements OnInit {

  stripHtml = stripHtml

  @Input()
  treeNode ! : OdmTreeNode

  get item$() {
    return this.treeNode.item$ as LearnItem$
  }

  constructor() { }

  ngOnInit() {}

  addChild($event: MouseEvent) {
    const item$ = this.treeNode.item$
    const odmService = item$.odmService as OdmService2<any, any, any, any>
    const newItemData = new LearnItem() // FIXME this should be smth like odmService.createNewItemData or automatically handled by odmService.newItem() -- to create new empty item - which is prolly a very common operation
    const newItem = odmService.newItem(undefined, newItemData, [item$])
    newItem.saveNowToDb()
    console.log('newItem', newItem)

  }

  deleteWithConfirmation() {

  }
}
