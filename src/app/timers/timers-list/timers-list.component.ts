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

}
