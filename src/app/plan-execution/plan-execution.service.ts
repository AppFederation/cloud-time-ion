import { Injectable } from '@angular/core';
import { TimeTrackingService } from '../time-tracking/time-tracking.service'
import { OryTreeNode } from '../tree-model/TreeModel'
import { columnDefs } from '../tree-shared/node-content/Columns'

@Injectable({
  providedIn: 'root'
})
export class PlanExecutionService {

  constructor(
    private timeTrackingService: TimeTrackingService,
  ) {
    this.timeTrackingService.timeTrackedEntry$.subscribe(ttEntry => {
      if ( ! ttEntry.isTrackingNow ) {
        return
      }
      Notification.requestPermission(() => {}).then(() => {

      })
      const node = ttEntry.timeTrackable as OryTreeNode
      const dbItem = node.dbItem
      // dbItem.data$.subscribe(data => {
      //   columnDefs.estimatedTime.getValueFromItemData(data)
      // })
      const minutesEstimated = node.getMinutes(columnDefs.estimatedTime)
      const percentages = [
        50, /* `Middle` */
        75, /* `Time to start wrapping-up!` */
        100 /* `Should be finished!` */
      ]
      for ( const percent of percentages ) {
        if (minutesEstimated > 0) {
          const msDuration = minutesEstimated * 60_000 * percent / 100
          const minutesLefToNotify = minutesEstimated * percent / 100
          console.log('PlanExecutionService minutes', minutesEstimated)
          ttEntry.notifyTrackedMsElapsedUntilPaused(msDuration, () => {
            const notificationTitle = '' + percent + `% ${minutesLefToNotify}m left - ` + node.getValueForColumn(columnDefs.title)
            console.log('notifyTrackedMsElapsed', node.getValueForColumn(columnDefs.title))
            const notification = new Notification(notificationTitle, { body: `Time to start wrapping-up!`, requireInteraction: true})
            // TODO: show minutes left
            // TODO: react to dbItem's data$ changes
            // TODO: unsubscribe
          })
        }
      }
    })
  }
}
