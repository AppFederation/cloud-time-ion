import { Component, OnInit } from '@angular/core';
import {StatsHistoryService} from '../core/stats-history.service'
import {map} from 'rxjs/operators'
import {HttpClient} from '@angular/common/http'
// import {dataGenerator} from './learn-stats-demo-data';

const API_STATS_URL = '/path/to/stats';  // TODO


function* dataToSingleValues(dataset: any) {
  for(const groupedData of dataset) {
    for(const ratingCount of Object.entries(groupedData['countByRating'])) {
      yield {
        "series": ratingCount[0],
        "count": ratingCount[1],
        "date": new Date(groupedData['whenCreated']['seconds'] * 1000),
      }
    }
  }
}


const DEMO_CHART = {
  "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
  // "data": {"url": "assets/unemployment-across-industries.json"},
  // "data": {"values": Array.from(dataToSingleValues(dataGenerator(30, new Date().getTime() / 1000)))},
  "data": {"name": "data", "values": []},
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
      "y": {"field": "count", "aggregate": "sum"},
      "color": {
        "field": "series",
        "scale": {"scheme": "category20b"}
      }
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
        "field": "count",
        "aggregate": "sum",
      },
      "color": {
        "field": "series",
        "scale": {"scheme": "category20b"}
      }
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

  spec: {} = DEMO_CHART;
  data: {}[] = [];

  constructor(
    public statsHistoryService: StatsHistoryService,
    public http: HttpClient,
  ) { }

  ngOnInit() {
    // Use demo data:
    // this.data = Array.from(dataToSingleValues(dataGenerator(30, new Date().getTime() / 1000)));

    this.http.get(API_STATS_URL).subscribe((data) => {
      this.data = Array.from(dataToSingleValues(data));
    });
  }

}
