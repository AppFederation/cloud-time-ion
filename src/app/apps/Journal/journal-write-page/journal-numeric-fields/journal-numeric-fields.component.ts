import {Component, Input, OnInit} from '@angular/core';
import {NumericPickerVal} from '../numeric-picker/numeric-picker.component'
import {JournalNumericDescriptor, JournalNumericDescriptors} from '../../models/JournalNumericDescriptors'

@Component({
  selector: 'app-journal-numeric-fields',
  templateUrl: './journal-numeric-fields.component.html',
  styleUrls: ['./journal-numeric-fields.component.sass'],
})
export class JournalNumericFieldsComponent implements OnInit {

  numDescriptors = JournalNumericDescriptors.instance.array

  search = ''

  @Input() journalEntry

  constructor() { }

  ngOnInit() {}

  onChangeNumericValue(numericPickerVal: NumericPickerVal, descriptor: JournalNumericDescriptor) {
    const patch = {}
    // TODO: figure out deep patches by path strings like in firebase (to prevent data loss)
    patch[descriptor.id] = {
      numVal: numericPickerVal
      // later: comments, maybe lastModified etc.
    }
    this.journalEntry.patchThrottled(patch)
  }

}