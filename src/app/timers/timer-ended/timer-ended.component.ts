import {Component, Input, OnInit} from '@angular/core';
import {Timer} from "../../core/Timer";

@Component({
  selector: 'app-timer-ended',
  templateUrl: './timer-ended.component.html',
  styleUrls: ['./timer-ended.component.scss'],
})
export class TimerEndedComponent implements OnInit {

  @Input() timer: Timer

  constructor() { }

  ngOnInit() {}

}
