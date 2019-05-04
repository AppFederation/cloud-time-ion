import {Component, Input, OnInit} from '@angular/core';
import {TimerItem} from "../../core/TimerItem";

@Component({
  selector: 'app-timer-ended',
  templateUrl: './timer-ended.component.html',
  styleUrls: ['./timer-ended.component.scss'],
})
export class TimerEndedComponent implements OnInit {

  @Input() timer: TimerItem

  constructor() { }

  ngOnInit() {}

}
