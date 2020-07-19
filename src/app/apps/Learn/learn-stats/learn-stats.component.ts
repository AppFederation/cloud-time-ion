import { Component, OnInit } from '@angular/core';
import {LearnStatsService} from '../core/learn-stats.service'

@Component({
  selector: 'app-learn-stats',
  templateUrl: './learn-stats.component.html',
  styleUrls: ['./learn-stats.component.sass'],
})
export class LearnStatsComponent implements OnInit {

  public stats$ = this.learnStatsService.stats$

  constructor(
    public learnStatsService: LearnStatsService,
  ) { }

  ngOnInit() {}

}
