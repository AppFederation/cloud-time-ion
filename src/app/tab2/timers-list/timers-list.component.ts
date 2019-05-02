import { Component, OnInit } from '@angular/core';
import {TimersService} from "../../core/timers.service";

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

}
