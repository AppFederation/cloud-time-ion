import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  TimeTrackedEntry,
  TimeTrackingService,
} from '../time-tracking.service'
import { DebugService } from '../../core/debug.service'

@Component({
  selector: 'app-time-tracking-cell',
  templateUrl: './time-tracking-cell.component.html',
  styleUrls: ['./time-tracking-toolbar.component.sass']
})
export class TimeTrackingCellComponent implements OnInit {

  // get timeTrackedEntry() { return this.timeTrackingService.timeTrackedEntry$.lastVal }

  @Input() timeTrackedEntry: TimeTrackedEntry //  = new TimeTrackedEntry(this.timeTrackingServiceOff, null)


  constructor(
    public timeTrackingServiceOff: TimeTrackingService,
    public debugService: DebugService,
  ) { }

  ngOnInit() {
  }

  onStopClicked() {
    // this.timeTrackingService.stopTimeTrackingOf()
  }

  onPlayClicked() {
    this.timeTrackedEntry.startOrResumeTracking() // could be first start or unpause
    // this.timeTrackingService.resume()
  }

  onPauseClicked() {
    this.timeTrackedEntry.pause()
    // this.timeTrackingService.pause()
  }
}
