import {Component, Input, OnInit} from '@angular/core';
import {NumericPickerVal} from '../../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {JournalNumericDescriptor, JournalNumericDescriptors} from '../../models/JournalNumericDescriptors'
import {JournalCompositeFieldVal, JournalEntry} from '../../models/JournalEntry'
import {JournalEntry$} from '../../models/JournalEntry$'

@Component({
  selector: 'app-journal-numeric-fields',
  templateUrl: './journal-numeric-fields.component.html',
  styleUrls: ['./journal-numeric-fields.component.sass'],
})
export class JournalNumericFieldsComponent implements OnInit {

  numDescriptors = JournalNumericDescriptors.instance.array

  search = ''

  @Input() journalEntry$ !: JournalEntry$

  showAny = false

  showAll = false

  constructor() { }

  ngOnInit() {}

  onChangeNumericValue(numericPickerVal: NumericPickerVal, descriptor: JournalNumericDescriptor) {
    const patch: any = {}
    // TODO: figure out deep patches by path strings like in firebase (to prevent data loss)
    const fieldVal: JournalCompositeFieldVal = {
      numVal: numericPickerVal
      // later: comments, maybe lastModified etc.
    }
    patch[descriptor.id !] = fieldVal
    this.journalEntry$.patchThrottled(patch)
  }

}
