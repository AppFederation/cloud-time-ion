import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Timer } from '../../core/Timer';
import { TimersService } from '../../core/timers.service';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent implements OnInit {

  @Input()
  timer: Timer

  // durationSeconds = 0

  get endTime() {
    return new Date(Date.now() + this.timer.durationSeconds * 1000)
  }

  constructor(
      public timersService: TimersService,
  ) { }

  ngOnInit() {}

  durationSecondsPlus() {
    this.timer.durationSeconds ++
    this.timersService.updateTimer(this.timer)
  }

  durationSecondsMinus() {
    this.timer.durationSeconds --
    this.timersService.updateTimer(this.timer)

  }
}
