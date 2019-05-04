import {Component, Input, OnInit} from '@angular/core';
import {TimerItem} from "../../core/TimerItem";

@Component({
  selector: 'app-timer-details',
  templateUrl: './timer-details.component.html',
  styleUrls: ['./timer-details.component.scss'],
})
export class TimerDetailsComponent implements OnInit {

  @Input()
  timer: TimerItem

  constructor() { }

  ngOnInit() {}

}
