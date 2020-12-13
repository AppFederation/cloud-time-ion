import {Component, Input, OnInit} from '@angular/core';
import {SelectionManager} from '../../SelectionManager'
import {Required} from '../../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {LearnItemId} from '../../../models/LearnItem'
import {OdmItemId} from '../../../../../libs/AppFedShared/odm/OdmItemId'
import {ViewSyncer2} from '../../../../../libs/AppFedShared/odm/ui/ViewSyncer2'
import {map} from 'rxjs/operators'
import {Observable} from 'rxjs/internal/Observable'

@Component({
  selector: 'app-selection-checkbox',
  templateUrl: './selection-checkbox.component.html',
  styleUrls: ['./selection-checkbox.component.sass'],
})
export class SelectionCheckboxComponent implements OnInit {

  @Required()
  @Input() selection ! : SelectionManager<OdmItemId>

  _itemId ! : LearnItemId

  isSelInManager$ ! : Observable<boolean>

  viewSyncer ! : ViewSyncer2<boolean, boolean>

  @Required()
  @Input() set itemId(x: LearnItemId) {
    this._itemId = x
    this.forceValueFromExternalIfPossible()
  }

  private forceValueFromExternalIfPossible() {
    this.viewSyncer?.forceValueFromExternal(this.isEffectivelySelectedInManager())
  }

  get itemId() { return this._itemId }

  constructor() { }

  ngOnInit() {
    this.isSelInManager$ = this.selection.effectiveSelectionChange$.pipe(map(() => {
      return this.isEffectivelySelectedInManager()
    }))
    this.viewSyncer = new ViewSyncer2<boolean, boolean>(
      this.isSelInManager$,
      (val) => {
        this.selection.setSelected(this.itemId, val)
      }
    )
    this.forceValueFromExternalIfPossible()
  }

  private isEffectivelySelectedInManager() {
    return this.selection.isEffectivelySelected(this.itemId)
  }

}
