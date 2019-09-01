import { Component, OnInit } from '@angular/core';
import { TimeTrackingService } from '../time-tracking.service'

@Component({
  selector: 'app-time-tracking-toolbar',
  templateUrl: './time-tracking-toolbar.component.html',
  styleUrls: ['./time-tracking-toolbar.component.sass']
})
export class TimeTrackingToolbarComponent implements OnInit {

  constructor(
    public timeTrackingService: TimeTrackingService
  ) { }

  ngOnInit() {
  }

}
