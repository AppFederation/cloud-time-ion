import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-success-chance',
  templateUrl: './success-chance.page.html',
  styleUrls: ['./success-chance.page.sass'],
})
export class SuccessChancePage implements OnInit {

  singleAttemptChance = 0.15

  attemptCounts = [1, 2, 3, 4, 5, 10, 15, 20, 30, 40, 50, 100]

  constructor() { }

  ngOnInit() {
  }

  probabilityFraction(number: number) {
    return 1 - ((1 - this.singleAttemptChance) ** number)
  }

  probabilityStr(count: number) {
    return (this.probabilityFraction(count) * 100).toFixed(1)
  }

  probabilityStrPercent(count: number) {
    return this.probabilityStr(count) + '%'
  }

  probabilityStrPx(count: number) {
    return this.probabilityStr(count) + 'px'
  }

  onSliderChange($event: any) {
    this.singleAttemptChance = $event.detail.value / 100
  }
}
