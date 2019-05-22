import { Component, OnInit } from '@angular/core';
import { TimeTrackingService } from '../time-tracking.service'

@Component({
  selector: 'app-time-tracking-toolbar',
  templateUrl: './time-tracking-toolbar.component.html',
  styleUrls: ['./time-tracking-toolbar.component.scss']
})
export class TimeTrackingToolbarComponent implements OnInit {
  private isPaused = false
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
    this.isPaused = false
  }

  onPauseClicked() {
    this.isPaused = true
  }
}
