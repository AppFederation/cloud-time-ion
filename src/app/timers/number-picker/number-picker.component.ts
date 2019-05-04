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

  constructor() { }

  ngOnInit() {}

  add() {
    this.value ++
    this.notifyChange()
  }

  subtract() {
    this.value --
    this.notifyChange()
  }

  private notifyChange() {
    this.change.emit(this.value)
  }
}
