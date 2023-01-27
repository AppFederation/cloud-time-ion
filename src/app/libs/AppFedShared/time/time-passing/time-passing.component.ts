import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from '../../base/base.component'

@Component({
  selector: 'app-time-passing',
  templateUrl: './time-passing.component.html',
  styleUrls: ['./time-passing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimePassingComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input()
  referenceTime : Date = new Date()

  @Input()
  isCountDown = true

  msDiff = 0

  private intervalHandle: any

  constructor(
      private changeDetectorRef: ChangeDetectorRef,
      private ngZone: NgZone,
  ) {
    super()

    this.ngZone.runOutsideAngular(() => {
      this.intervalHandle = setInterval(() => {
          // https://medium.com/@krzysztof.grzybek89/how-runoutsideangular-might-reduce-change-detection-calls-in-your-app-6b4dab6e374d
          this.update();
        // could this be causing ExpressionChangedAfterChecked ?
      }, 500)
    })
  }

  private update() {
    // FIXME: Cannot read property 'getTime' of null
    if ( this.isCountDown ) {
      this.msDiff = this.referenceTime.getTime() - Date.now()
    } else {
      this.msDiff = Date.now() - this.referenceTime.getTime()
      // could this be causing ExpressionChangedAfterChecked ?
    }
    this.changeDetectorRef.detectChanges()
    // this.changeDetectorRef.markForCheck()
  }

  ngOnInit() {
    this.update();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalHandle)
  }

}
