import {Component, Input, OnInit} from '@angular/core';
import {SelectionManager} from '../../SelectionManager'
import {Required} from '../../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {LearnItemId} from '../../../models/LearnItem'

@Component({
  selector: 'app-selection-checkbox',
  templateUrl: './selection-checkbox.component.html',
  styleUrls: ['./selection-checkbox.component.sass'],
})
export class SelectionCheckboxComponent implements OnInit {

  @Required()
  @Input() selection ! : SelectionManager

  @Required()
  @Input() itemId ! : LearnItemId


  constructor() { }

  ngOnInit() {}

  setSelected($event: any) {
    this.selection.setSelected(this.itemId, ($event as any).detail.checked)
  }
}
