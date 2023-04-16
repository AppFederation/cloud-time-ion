import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DebugService } from '../../core/debug.service'
import {Config, ConfigService} from '../../core/config.service'
import {TimeTrackedEntry, TimeTrackingJsObjVal} from '../TimeTrackedEntry'
import {CachedSubject} from '../../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {stripHtml} from '../../../../libs/AppFedShared/utils/html-utils'

@Component({
  selector: 'app-time-tracking-cell',
  templateUrl: './time-tracking-cell.component.html',
  styleUrls: ['./time-tracking-cell.component.sass']
})
export class TimeTrackingCellComponent implements OnInit {

  // get timeTrackedEntry() { return this.timeTrackingService.timeTrackedEntry$.lastVal }

  @Input() timeTrackedEntry!: TimeTrackedEntry //  = new TimeTrackedEntry(this.timeTrackingServiceOff, null)

  @Input() toolBarMode!: boolean

  getDisplayTitle(data: any) {
    return stripHtml(
      data?. title
    )?. substring(0, 20)
  }

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

  // idea: long-press on pause would stop (and set done)

  onStopClicked() {
    // this.timeTrackingService.stopTimeTrackingOf()
  }

  onPlayClicked($event1: MouseEvent | Event, opts?: {inParallel: boolean}) {
    const $event = $event1 as MouseEvent | { srcEvent: MouseEvent }
    console.log(`onPlayClicked $event`, $event)
    Notification.requestPermission().then(ret => {
      console.log(`Notification.requestPermission .then`, ret)
    })
    this.timeTrackedEntry.startOrResumeTrackingIfNeeded(opts) // could be first start or unpause
    if ( 'stopPropagation' in $event) {
      $event.stopPropagation()
    } else {
      $event.srcEvent.stopPropagation()
    }
    if ( 'preventDefault' in $event ) {
      $event.preventDefault()
    } else {
      $event.srcEvent.preventDefault()
    }
  }

  onPauseClicked($event: MouseEvent) {
    this.timeTrackedEntry.pauseOrNoop()
    $event.stopPropagation()
    // this.timeTrackingService.pause()
  }
}
