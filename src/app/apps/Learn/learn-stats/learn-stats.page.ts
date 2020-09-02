import { Component, OnInit } from '@angular/core';
import {StatsHistoryService} from '../core/stats-history.service'
import {map} from 'rxjs/operators'

@Component({
  selector: 'app-learn-stats',
  templateUrl: './learn-stats.page.html',
  styleUrls: ['./learn-stats.page.sass'],
})
export class LearnStatsPage implements OnInit {
  items$ = this.statsHistoryService.localItems$.pipe(map(
    item$s => {
      return item$s.map(_ => _.currentVal)
    }
  ))

  constructor(
    public statsHistoryService: StatsHistoryService,
  ) { }

  ngOnInit() {
  }

}
