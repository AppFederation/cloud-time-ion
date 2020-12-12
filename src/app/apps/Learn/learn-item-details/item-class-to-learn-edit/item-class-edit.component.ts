import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms'
import {ViewSyncer} from '../../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {LearnItem$} from '../../models/LearnItem$'

@Component({
  selector: 'app-item-class-to-learn-edit',
  templateUrl: './item-class-edit.component.html',
  styleUrls: ['./item-class-edit.component.sass'],
})
export class ItemClassToLearnEditComponent implements OnInit {

  readonly fieldName = 'isToLearn'

  formControls = {
    isToLearn: new FormControl(),
  }

  formGroup = new FormGroup(this.formControls)

  viewSyncer ! : ViewSyncer

  @Input()
  @Required()
  public item$ ! : LearnItem$

  constructor() { }

  ngOnInit() {
    this.viewSyncer = new ViewSyncer(
      this.formGroup,
      this.item$,
      false,
      this.fieldName
    )
  }
}