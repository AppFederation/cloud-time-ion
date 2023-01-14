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

  probability(number: number) {
    return 1 - ((1 - this.singleAttemptChance) ** number)
  }
}
