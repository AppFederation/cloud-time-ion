import {Component, Input, OnInit} from '@angular/core';
import {importanceDescriptorsArray, LearnItem} from '../../models/LearnItem'
import {FormControl, FormGroup} from '@angular/forms'
import {ViewSyncer} from '../../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {SideFormControlsDict} from '../../shared/item-side/item-side.component'
import {LearnItem$} from '../../models/LearnItem$'
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'

@Component({
  selector: 'app-importance-edit',
  templateUrl: './importance-edit.component.html',
  styleUrls: ['./importance.component.sass'],
})
export class ImportanceEditComponent implements OnInit {

  importanceDescriptorsArray = importanceDescriptorsArray

  formGroup ! : FormGroup

  formControls = {
    importance: new FormControl(),
  }

  viewSyncer ! : ViewSyncer

  @Input() @Required()
  public item$ ! : LearnItem$

  constructor() { }

  ngOnInit() {
    this.formGroup = new FormGroup(this.formControls)
    this.viewSyncer = new ViewSyncer(this.formGroup, this.item$, false, 'importance') /* TODO might need to ignore other fields from db */
    // const origPatchFn = this.item$.patchThrottled
    // this.item$.patchThrottled = function() {
    //   console.log(`importance patchThrottled args `, arguments)
    //   // origPatchFn()
    // }

  }

}
