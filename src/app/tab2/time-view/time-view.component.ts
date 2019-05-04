import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-time-view',
  templateUrl: './time-view.component.html',
  styleUrls: ['./time-view.component.scss'],
})
export class TimeViewComponent implements OnInit {

  @Input()
  timeMs: number = 0

  get timeSecs() {
    return this.timeMs / 1000
  }

  get seconds() {
    return ("" + this.timeSecs % 60).padStart(2, '0')
  }

  get minutes() {
    return Math.floor((this.timeSecs / 60) % 60)
  }

  get hours() {
    return Math.floor(this.timeSecs / 3600)
  }

  constructor() { }

  ngOnInit() {}

}
