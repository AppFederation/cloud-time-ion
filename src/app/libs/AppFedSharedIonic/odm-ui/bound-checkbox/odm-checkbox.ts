import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms'
import {ViewSyncer} from '../../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {OdmItem$2} from '../../../AppFedShared/odm/OdmItem$2'

@Component({
  selector: 'odm-checkbox',
  templateUrl: './odm-checkbox.html',
  styleUrls: ['./odm-checkbox.sass'],
})
export class OdmCheckbox implements OnInit {

  @Input()
  @Required()
  fieldName!: string

  @Input()
  @Required()
  public item$ ! : OdmItem$2<any, any, any, any>

  formControls!: any

  formGroup!: FormGroup

  viewSyncer ! : ViewSyncer

  constructor() { }

  ngOnInit() {
    this.formControls = {
      [this.fieldName]: new FormControl(),
    }
    this.formGroup = new FormGroup(this.formControls)
    this.viewSyncer = new ViewSyncer(
      this.formGroup,
      this.item$,
      false,
      this.fieldName
    )
  }
}
