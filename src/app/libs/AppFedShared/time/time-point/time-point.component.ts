import {Component, Input, OnInit} from '@angular/core';
import {nullish} from '../../utils/type-utils'

@Component({
  selector: 'app-time-point',
  templateUrl: './time-point.component.html',
  styleUrls: ['./time-point.component.sass'],
})
export class TimePointComponent implements OnInit {

  @Input()
  time ? : Date | nullish

  dayNames = [
    // 0 steht für Sonntag
    `Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`,
  ]

  get isInFuture() {
    return (this.time ?. getTime() ?? 0) - 1000 > Date.now()
  }

  constructor() { }

  ngOnInit() {}

  process(time ? : Date) {
    try {
      return time?.toISOString()?.replace('T', ' ')?.replace(/\.\d\d\dZ/gi, '')
    } catch (e) {
      return 'invalid-date'
    }
    //
  }
}
