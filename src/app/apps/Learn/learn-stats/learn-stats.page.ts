import { Component, OnInit } from '@angular/core';
import {StatsHistoryService} from '../core/stats-history.service'
import {map} from 'rxjs/operators'
import {HttpClient} from '@angular/common/http'
import {StoredLearnStats} from '../core/learn-stats.service'
import {OdmInMemItem} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {debugLog, errorAlert} from '../../../libs/AppFedShared/utils/log'


function* dataToSingleValues(dataset: (StoredLearnStats & OdmInMemItem)[]) {
  const dates = new Set<string>()
  for(const statEntry of dataset) {
    const date = new Date(statEntry.whenCreated!.seconds * 1000 + statEntry.whenCreated!.nanoseconds / 1000_000 )
    // const dateToBePutToSet = date.toISOString()
    const dateToBePutToSet = ''+date
    if ( dates.has(dateToBePutToSet) ) {
      debugLog(`dates.has(date)`, dateToBePutToSet)
      continue
    } else {
      dates.add(dateToBePutToSet)
    }
    for(const ratingCount of Object.entries(statEntry.countByRating??{})) {
      const key = ratingCount[0]

      yield {
        "series": key === 'undefined' ? '-' : key /* workaround for https://github.com/vega/vega-lite/issues/1734
        https://stackoverflow.com/questions/59185661/order-stacked-vega-lite-bar-graph-by-specific-order
        -> ```A workaround is to use a calculate transform to encode the desired order.
          A simple example of this can be found here: https://vega.github.io/vega-lite/docs/stack.html#order ```
      */,
        "count": (ratingCount[1] as number),
        "date": date,
      }
    }
  }
}


@Component({
  selector: 'app-learn-stats',
  templateUrl: './learn-stats.page.html',
  styleUrls: ['./learn-stats.page.sass'],
})
export class LearnStatsPage implements OnInit {
  items$ = this.statsHistoryService.localItems$.pipe(map(
    item$s => {
      return item$s.filter(_ => {
        const undefCount = _.val?.countByRating?.['undefined']
        const b = undefCount < 9999
        if ( b ) {
          // debugLog(`countByRating`, undefCount, _.val)
        }
        return b
      })
      . map(_ => _.currentVal)
    }
  ))

  data: {series: string, count: number, date: Date}[] = [];

  constructor(
    public statsHistoryService: StatsHistoryService,
    public http: HttpClient,
  ) { }

  ngOnInit() {
    // Use demo data:
    // this.data = Array.from(dataToSingleValues(dataGenerator(30, new Date().getTime() / 1000)));

    this.items$.subscribe((data: (StoredLearnStats & OdmInMemItem)[]) => {
      this.data = [...dataToSingleValues(data)];
    });
  }

}
