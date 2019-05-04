import {Component, Input, OnInit} from '@angular/core';
import {Timer} from "../../core/Timer";

@Component({
  selector: 'app-timer-details',
  templateUrl: './timer-details.component.html',
  styleUrls: ['./timer-details.component.scss'],
})
export class TimerDetailsComponent implements OnInit {

  @Input()
  timer: Timer

  constructor() { }

  ngOnInit() {}

}
