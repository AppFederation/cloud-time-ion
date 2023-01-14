import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exponential-improvement',
  templateUrl: './exponential-improvement.page.html',
  styleUrls: ['./exponential-improvement.page.sass'],
})
export class ExponentialImprovementPage implements OnInit {

  periods = ['1 month', '1 year', '2 years', '3 years', '4 years', '5 years', '10 years', '100 years']

  constructor() { }

  ngOnInit() {
  }

}
