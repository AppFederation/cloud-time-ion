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
import { ConfigService } from '../../core/config.service'
import { TimeTrackingPeriodsService } from '../time-tracking-periods.service'

@Component({
  selector: 'app-time-tracking-cell',
  templateUrl: './time-tracking-cell.component.html',
  styleUrls: ['./time-tracking-cell.component.sass']
})
export class TimeTrackingCellComponent implements OnInit {

  // get timeTrackedEntry() { return this.timeTrackingService.timeTrackedEntry$.lastVal }

  @Input() timeTrackedEntry: TimeTrackedEntry //  = new TimeTrackedEntry(this.timeTrackingServiceOff, null)

  @Input() toolBarMode: boolean

  config$ = this.configService.config$

  constructor(
    public configService: ConfigService,
    public timeTrackingServiceOff: TimeTrackingService,
    public debugService: DebugService,
  ) { }

  ngOnInit() {
  }

  onStopClicked() {
    // this.timeTrackingService.stopTimeTrackingOf()
  }

  onPlayClicked($event: MouseEvent) {
    Notification.requestPermission().then(ret => {
      console.log(`Notification.requestPermission .then`, ret)
    })
    this.timeTrackedEntry.startOrResumeTrackingIfNeeded() // could be first start or unpause
    $event.stopPropagation()
    // this.timeTrackingService.resume()
  }

  onPauseClicked($event: MouseEvent) {
    this.timeTrackedEntry.pauseOrNoop()
    $event.stopPropagation()
    // this.timeTrackingService.pause()
  }
}
