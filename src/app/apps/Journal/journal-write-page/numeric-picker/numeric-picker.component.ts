import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {JournalNumericDescriptor} from '../../journal-models/JournalNumericDescriptors'

export type NumericPickerVal = number

/* maybe: make it a custom form control */
@Component({
  selector: 'apf-numeric-picker',
  templateUrl: './numeric-picker.component.html',
  styleUrls: ['./mood-picker.component.sass'],
})
export class NumericPickerComponent implements OnInit {

  @Output() numericValue = new EventEmitter<NumericPickerVal>()

  @Input() numFieldDef: JournalNumericDescriptor

  @Input() minNum: number
  @Input() maxNum: number

  numValFormControl = new FormControl()

  numVal: NumericPickerVal

  constructor() { }

  ngOnInit() {}

  setNumVal(numVal: number) {
    this.numVal = numVal
    this.numericValue.next(numVal)
  }
}
