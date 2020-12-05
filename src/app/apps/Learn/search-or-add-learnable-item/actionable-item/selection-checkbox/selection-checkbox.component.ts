import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {SelectionManager} from '../../SelectionManager'
import {Required} from '../../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {LearnItemId} from '../../../models/LearnItem'
import {OdmItemId} from '../../../../../libs/AppFedShared/odm/OdmItemId'
import {IonCheckbox} from '@ionic/angular'

@Component({
  selector: 'app-selection-checkbox',
  templateUrl: './selection-checkbox.component.html',
  styleUrls: ['./selection-checkbox.component.sass'],
})
export class SelectionCheckboxComponent implements OnInit, AfterViewInit {

  @Required()
  @Input() selection ! : SelectionManager<OdmItemId>

  _itemId ! : LearnItemId

  private isSetting = false

  @Required()
  @Input() set itemId(x: LearnItemId) {
    this._itemId = x
    this.setCheckedIfPossible()
  }

  private setCheckedIfPossible() {
    const isSel = this.selection.isEffectivelySelected(this.itemId)
    if ( this.checkBox ) {
      // would not need this if FormControl
      // could have used smth like ViewSyncer with FormControl (with flexible functions to observe/set, instead of relying on PatchableObservable face); simplifying logic here
      // whereas current ViewSyncer could be a subclass of that basic ViewSyncer -> PatchableObservableViewSyncer
      // or "...FormControlSyncer"
      this.checkBox.checked = isSel
    }
  }

  get itemId() { return this._itemId }

  @ViewChild(IonCheckbox) checkBox ! : IonCheckbox

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.setCheckedIfPossible()
    this.selection.effectiveSelectionChange$.subscribe(() => {
      if ( ! this.isSetting ) {
        try {
          this.isSetting = true
          this.setCheckedIfPossible()
        } finally {
          this.isSetting = false
        }
      }
    })
  }

  setSelected($event: any) {
    if ( ! this.isSetting ) {
      try {
        this.isSetting = true
        this.selection.setSelected(this.itemId, ($event as any).detail.checked)
      } finally {
        this.isSetting = false
      }
    }
  }
}
