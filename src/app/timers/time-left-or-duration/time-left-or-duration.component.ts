import {Component, Input, OnInit} from '@angular/core';
import {TimerItem} from "../../core/TimerItem";

@Component({
  selector: 'app-time-left-or-duration',
  templateUrl: './time-left-or-duration.component.html',
  styleUrls: ['./time-left-or-duration.component.sass'],
})
export class TimeLeftOrDurationComponent implements OnInit {

  @Input()
  timer ! : TimerItem

  get endTime() {
    return this.timer.endTime !
  }

  constructor() { }

  ngOnInit() {}

}
