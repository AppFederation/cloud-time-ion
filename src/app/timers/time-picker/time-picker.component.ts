import {
  Component, EventEmitter,
  Input,
  OnInit, Output,
} from '@angular/core';
import {PickerController} from "@ionic/angular";

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

  async openTimePicker() {
    let pickerElement = await this.pickerController.create({
      buttons: [{
        text: 'Done',
      }],
      columns: [
        {
          name: 'days',
          options: [
            {
              text: '1',
              value: 1
            },
            {
              text: '2',
              value: 2
            },
            {
              text: '3',
              value: 3
            },
          ]
        },
        {
          name: 'years',
          options: [
            {
              text: '1992',
              value: 1992
            },
            {
              text: '1993',
              value: 1993
            },
            {
              text: '1994',
              value: 1994
            },
          ]
        },
      ]
    });
    await pickerElement.present()
  }
}
