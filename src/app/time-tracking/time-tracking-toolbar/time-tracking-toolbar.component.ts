import { Component, OnInit } from '@angular/core';
import { TimeTrackingService } from '../time-tracking.service'

@Component({
  selector: 'app-time-tracking-toolbar',
  templateUrl: './time-tracking-toolbar.component.html',
  styleUrls: ['./time-tracking-toolbar.component.scss']
})
export class TimeTrackingToolbarComponent implements OnInit {

  get timeTrackedEntry() { return this.timeTrackingService.timeTracked$.lastVal }


  constructor(
    public timeTrackingService: TimeTrackingService
  ) { }

  ngOnInit() {
  }

  onStopClicked() {
    this.timeTrackingService.stopTimeTrackingOf()
  }

  onPlayClicked() {
    this.timeTrackingService.resume()
  }

  onPauseClicked() {
    this.timeTrackingService.pause()
  }
}
