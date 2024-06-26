import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import { TimeService } from '../../../core/time.service'
import {TimeTrackedEntry} from '../../../time-tracking/TimeTrackedEntry'

@Component({
  selector: 'app-time-passing',
  templateUrl: './time-passing.component.html',
  styleUrls: ['./time-passing.component.sass'],
})
export class TimePassingComponent implements OnInit, OnDestroy {

  @Input()
  referenceTime : Date | null | undefined = new Date()

  @Input()
  isCountDown: boolean = true

  @Input()
  pausableEntry!: TimeTrackedEntry

  msDiff = 0

  private readonly intervalHandle: any

  constructor(
      private changeDetectorRef: ChangeDetectorRef,
      public timeService: TimeService,
  ) {
    this.intervalHandle = setInterval(() => {
      this.update();
    }, 500)
  }

  private update() {
    // console.log(`time-passing update`, this)
    if ( ! this.referenceTime ) {
      return
    }
    // FIXME: Cannot read property 'getTime' of null
    if ( this.isCountDown ) {
      this.msDiff = this.referenceTime.getTime() - this.nowMs()
    } else {
      this.msDiff = this.nowMs() - this.referenceTime.getTime()
    }
    if ( this.pausableEntry ) {
      this.msDiff = this.pausableEntry.totalMsExcludingPauses
      // console.log(`this.msDiff`, this.msDiff, this.pausableEntry)
    }
    // this.changeDetectorRef.detectChanges()
    this.changeDetectorRef.markForCheck()
  }

  private nowMs() {
    return this.timeService.now().getTime()
  }

  ngOnInit() {
    this.update();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalHandle)
  }

}
