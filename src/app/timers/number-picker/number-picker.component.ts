import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrls: ['./number-picker.component.scss'],
})
export class NumberPickerComponent implements OnInit {

  @Input()
  value: number = 0

  @Output()
  change = new EventEmitter<number>()

  private allowNegative = true

  constructor() { }

  ngOnInit() {}

  add() {
    this.value ++
    this.notifyChange()
  }

  subtract() {
    this.value --
    if ( ! this.allowNegative ) {
      this.value = Math.max(0, this.value)
    }
    this.notifyChange()
  }

  private notifyChange() {
    this.change.emit(this.value)
  }
}
