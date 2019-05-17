import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {PickerController} from "@ionic/angular";

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent implements OnInit {

  showTimePicker = false

  @Output()
  durationSecondsChanged = new EventEmitter<number>()

  // durationSeconds = 0
  pickerSeconds = 0
  pickerMinutes = 0
  pickerHours = 0

  @Input()
  totalTimeSeconds: number

  constructor(
    public pickerController: PickerController,
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

  colHours() { return {
    name: 'hours',
    options: this.getOptions(24),
    refresh: () => {
      console.log('colHours refresh test')
    },
    selectedIndex: this.pickerHours,
  }}

  async openTimePicker() {
    let pickerElement = await this.pickerController.create({
      buttons: [{
        text: 'Done',
        handler: (value) => {
          this.pickerHours = value.hours.value
          this.pickerMinutes = value.minutes.value
          this.pickerSeconds= value.seconds.value
          this.onChangeTime()
        }
      }],
      columns: [
        this.colHours(),
        {
          name: 'minutes',
          options: this.getOptions(60),
          selectedIndex: this.pickerMinutes,
        },
        {
          name: 'seconds',
          options: this.getOptions(60),
          selectedIndex: this.pickerSeconds,
        },
      ]
    });
    let ret = await pickerElement.present();
  }

  private getOptions(count) {
    return Array.from(new Array(count).keys()).map(k => {
      return {
        text: '' + k,
        value: k,
      }
    });
  }
}
