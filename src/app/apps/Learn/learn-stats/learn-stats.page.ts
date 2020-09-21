import { Component, OnInit } from '@angular/core';
import {StatsHistoryService} from '../core/stats-history.service'
import {map} from 'rxjs/operators'


const CHART_SPEC = {
  "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
  // "data": {"url": "/assets/charts/data/stocks.csv"},
  "vconcat": [{
    "width": 480,
    "mark": "area",
    "encoding": {
      "x": {
        "field": "date",
        "type": "temporal",
        "scale": {"domain": {"selection": "brush"}},
        "axis": {"title": ""}
      },
      "y": {"field": "price", "type": "quantitative", "aggregate": "sum"},
      "color": {"field": "symbol", "type": "nominal"}
    }
  }, {
    "width": 480,
    "height": 60,
    "mark": "area",
    "selection": {
      "brush": {"type": "interval", "encodings": ["x"]}
    },
    "encoding": {
      "x": {
        "field": "date",
        "type": "temporal"
      },
      "y": {
        "field": "price",
        "aggregate": "sum",
        "axis": {"tickCount": 3, "grid": false}
      },
      "color": {"field": "symbol", "type": "nominal"}
    }
  }]
}



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

  spec: {} = CHART_SPEC;

  constructor(
    public statsHistoryService: StatsHistoryService,
  ) { }

  ngOnInit() {
  }

}
