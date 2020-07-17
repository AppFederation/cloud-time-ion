import {Component, Input, OnInit} from '@angular/core';

const round = (t: number) => t < 0 ? Math.ceil(t) : Math.floor(t)

const padTime = (time: number) => {
  if ( time < 0 ) {
    return '-' + ('' + Math.abs(time)).padStart(2, '0')
  } else {
    return ('' + time).padStart(2, '0')
  }
}

@Component({
  selector: 'app-time-view',
  templateUrl: './time-view.component.html',
  styleUrls: ['./time-view.component.scss'],
})
export class TimeViewComponent implements OnInit {

  @Input()
  timeMs: number = 0

  get timeSecsRound() {
    return round(this.timeMs / 1000)
  }

  get seconds() {
    return this.timeSecsRound % 60
  }

  get secsTxt() { return padTime(this.seconds) }

  get minutes() {
    return round((this.timeSecsRound / 60) % 60)
  }

  get minsTxt() { return padTime(this.minutes) }

  get hours() {
    return round(this.timeSecsRound / 3600)
  }

  get hrsTxt() { return '' + this.hours }

  get hasHrs() { return this.hours !== 0}

  constructor() { }

  ngOnInit() {}

}
