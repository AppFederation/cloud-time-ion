import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {JournalNumericDescriptor} from '../../models/JournalNumericDescriptors'

export type NumericPickerVal = number

/* maybe: make it a custom form control */
@Component({
  selector: 'apf-numeric-picker',
  templateUrl: './numeric-picker.component.html',
  styleUrls: ['./mood-picker.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  setNumVal(newNumVal: number) {
    if ( newNumVal === this.numVal ) {
      this.numVal = newNumVal + 0.5
    } else {
      this.numVal = newNumVal
    }
    this.numericValue.next(this.numVal)
    // note this triggers change detection
  }
}
