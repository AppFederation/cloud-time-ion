import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exponential-improvement',
  templateUrl: './exponential-improvement.page.html',
  styleUrls: ['./exponential-improvement.page.sass'],
})
export class ExponentialImprovementPage implements OnInit {

  periods = ['1 month', '1 year', '2 years', '3 years', '4 years', '5 years', '10 years', '100 years']
  periodsDays = [1, 7, 15, 30, 60, 90, 180, 365, 365 * 2, 365 * 3, 365 * 4, 365 * 5, 365 * 10/*, 365 * 100*/]

  incrementFraction = 0.02

  constructor() { }

  ngOnInit() {
  }

  improvementFraction(count: number) {
    return ((1 + this.incrementFraction) ** count)
  }

  improvementFractionLinear(count: number) {
    return (1 + this.incrementFraction * count)
  }

  onSliderChange($event: any) {
    this.incrementFraction = $event.detail.value / 100
  }

}
