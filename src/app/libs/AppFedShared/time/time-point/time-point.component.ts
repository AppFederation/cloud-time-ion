import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-time-point',
  templateUrl: './time-point.component.html',
  styleUrls: ['./time-point.component.sass'],
})
export class TimePointComponent implements OnInit {

  @Input() time: Date

  get isInFuture() {
    return this.time ?. getTime() + 1000 > Date.now()
  }

  constructor() { }

  ngOnInit() {}

  process(time: Date) {
    return time ?. toISOString() ?. replace('T', ' ') ?. replace(/\.\d\d\dZ/gi, '')
    //
  }
}
