import { Component, OnInit } from '@angular/core';
import {StatsHistoryService} from '../core/stats-history.service'
import {map} from 'rxjs/operators'
import {HttpClient} from '@angular/common/http'
import {StoredLearnStats} from '../core/learn-stats.service'
import {OdmInMemItem} from '../../../libs/AppFedShared/odm/OdmItem$2'


function* dataToSingleValues(dataset: (StoredLearnStats & OdmInMemItem)[]) {
  for(const statEntry of dataset) {
    for(const ratingCount of Object.entries(statEntry.countByRating??{})) {
      const key = ratingCount[0]
      yield {
        "series": key === 'undefined' ? '-' : key,
        "count": ratingCount[1],
        "date": new Date(statEntry.whenCreated!.seconds * 1000),
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
  data: {series: string, count: number, date: Date}[] = [];

  constructor(
    public statsHistoryService: StatsHistoryService,
    public http: HttpClient,
  ) { }

  ngOnInit() {
    // Use demo data:
    // this.data = Array.from(dataToSingleValues(dataGenerator(30, new Date().getTime() / 1000)));
    // this.data = [...dataToSingleValues(CHART_TEST_DATA)];

    // this.items$ = of(CHART_TEST_DATA);
    this.items$.subscribe((data: (StoredLearnStats & OdmInMemItem)[]) => {
      console.log('Items', data);
      this.data = [...dataToSingleValues(data)];
    })
  }

}
