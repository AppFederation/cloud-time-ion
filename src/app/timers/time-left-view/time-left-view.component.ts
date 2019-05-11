import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-time-left-view',
  templateUrl: './time-left-view.component.html',
  styleUrls: ['./time-left-view.component.scss'],
})
export class TimeLeftViewComponent implements OnInit, OnDestroy {

  @Input()
  endTime: Date

  msLeft = 0
  private readonly intervalHandle: number

  constructor(
      private changeDetectorRef: ChangeDetectorRef
  ) {
    this.intervalHandle = setInterval(() => {
      this.update();
    }, 500)
  }

  private update() {
    this.msLeft = this.endTime.getTime() - Date.now()
    // this.changeDetectorRef.detectChanges()
    this.changeDetectorRef.markForCheck()
  }

  ngOnInit() {
    this.update();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalHandle)
  }

}
