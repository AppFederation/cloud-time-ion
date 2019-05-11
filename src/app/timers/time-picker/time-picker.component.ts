import {
  Component, EventEmitter,
  Input,
  OnInit, Output,
} from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent implements OnInit {

  @Output()
  durationSecondsChanged = new EventEmitter<number>()

  // durationSeconds = 0
  pickerSeconds = 0
  pickerMinutes = 0
  pickerHours = 0

  @Input()
  totalTimeSeconds: number

  constructor(
      // public timersService: TimersService,
  ) { }

  ngOnInit() {
    this.pickerHours = Math.floor(this.totalTimeSeconds / 3600)
    this.pickerMinutes = Math.floor((this.totalTimeSeconds / 60) % 60)
    this.pickerSeconds = this.totalTimeSeconds % 60
  }

  onChangeTime() {
    this.totalTimeSeconds = this.pickerSeconds + 60 * this.pickerMinutes + 3600 * this.pickerHours
    this.durationSecondsChanged.emit(this.totalTimeSeconds)
  }
}
