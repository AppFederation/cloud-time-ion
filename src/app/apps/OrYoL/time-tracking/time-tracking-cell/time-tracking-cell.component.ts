import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DebugService } from '../../core/debug.service'
import {Config, ConfigService} from '../../core/config.service'
import {TimeTrackedEntry, TimeTrackingJsObjVal} from '../TimeTrackedEntry'
import {CachedSubject} from '../../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'

@Component({
  selector: 'app-time-tracking-cell',
  templateUrl: './time-tracking-cell.component.html',
  styleUrls: ['./time-tracking-cell.component.sass']
})
export class TimeTrackingCellComponent implements OnInit {

  // get timeTrackedEntry() { return this.timeTrackingService.timeTrackedEntry$.lastVal }

  @Input() timeTrackedEntry!: TimeTrackedEntry //  = new TimeTrackedEntry(this.timeTrackingServiceOff, null)

  @Input() toolBarMode!: boolean

  config$: CachedSubject<Config> = this.configService.config$

  public timeTrackVal$!: CachedSubject<TimeTrackingJsObjVal | undefined>

  constructor(
    public configService: ConfigService,
    public debugService: DebugService,
  ) {

  }

  ngOnInit() {
    this.timeTrackVal$ = this.timeTrackedEntry.timeTrackVal$
    // this.timeTrackVal$.subscribe(val => {
      // console.log(`this.timeTrackVal$.subscribe val`, val)
    // })
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
