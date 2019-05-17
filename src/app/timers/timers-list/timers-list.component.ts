import { Component, OnInit } from '@angular/core';
import {TimersService} from "../../core/timers.service";
import {TimerItem} from "../../core/TimerItem";

@Component({
  selector: 'app-timers-list',
  templateUrl: './timers-list.component.html',
  styleUrls: ['./timers-list.component.scss'],
})
export class TimersListComponent implements OnInit {

  constructor(
      public timersService: TimersService,
  ) { }

  ngOnInit() {}

  trackById(index: number, item: TimerItem) {
    return item.id
  }


  sortTimers(timers: TimerItem[]) {
    if ( timers == null ) {
      return timers
    }
    return timers.sort((t1, t2) => {
      if ( t1.isRunning && t2.isRunning ) {
        return t1.endTime.getTime() - t2.endTime.getTime()
      }
      if ( t1.isRunning) {
        return -1 // TODO more
      } else if ( t2.isRunning) {
        return 1 // TODO more
      } else {
        return t1.durationSeconds - t2.durationSeconds
      }
    })
  }
}
