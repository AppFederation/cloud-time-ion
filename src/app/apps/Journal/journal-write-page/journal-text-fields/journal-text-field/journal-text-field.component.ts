import {Component, Input, OnInit} from '@angular/core';
import {JournalTextDescriptor, TextDescriptorsFormControlsDict} from '../../../models/JournalTextDescriptors'
import {FormControl, FormGroup} from '@angular/forms'
import {ViewSyncer} from '../../../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {JournalEntry} from '../../../models/JournalEntry'
import {JournalEntry$} from '../../../models/JournalEntry$'

@Component({
  selector: 'app-journal-text-field',
  templateUrl: './journal-text-field.component.html',
  styleUrls: ['./journal-text-field.component.sass'],
})
export class JournalTextFieldComponent implements OnInit {

  @Input() item$ ! : JournalEntry$

  @Input() fieldDescriptor ! : JournalTextDescriptor

  formControls ! : TextDescriptorsFormControlsDict

  formGroup ! : FormGroup

  constructor() { }

  get formControl() {
    return this.formControls[this.fieldDescriptor.id ! as keyof TextDescriptorsFormControlsDict]
  }

  /** TODO     *ngIf="viewSyncer.initialDataArrived else notLoaded" */
  viewSyncer ! : ViewSyncer


  ngOnInit() {
    this.formControls = this.createFormControlDict()
    this.formGroup = new FormGroup(this.formControls)
    this.viewSyncer = new ViewSyncer(this.formGroup, this.item$, true, this.fieldDescriptor !. id as keyof JournalEntry) /* TODO might need to ignore other fields from db */
  }

  private createFormControlDict(): TextDescriptorsFormControlsDict {
    const ret = {} as TextDescriptorsFormControlsDict
    ret[this.fieldDescriptor. id ! as keyof TextDescriptorsFormControlsDict] = new FormControl()
    // console.dir(ret)
    return ret
  }

}
