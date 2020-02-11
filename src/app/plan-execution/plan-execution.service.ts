import { Injectable } from '@angular/core';
import {
  TimeTrackedEntry,
  TimeTrackingService,
} from '../time-tracking/time-tracking.service'
import { OryTreeNode } from '../tree-model/TreeModel'
import { columnDefs } from '../tree-shared/node-content/Columns'
import { Subscription } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class PlanExecutionService {
  private dbItemDataSubscriptions: Subscription[] = []

  constructor(
    private timeTrackingService: TimeTrackingService,
  ) {
    this.timeTrackingService.timeTrackedEntry$.subscribe(ttEntryNotified => {
      Notification.requestPermission(() => {}).then(() => {
      })
      const ttEntries = [ ttEntryNotified /* emulate multi-time-tracking */ ]
      this.cancelDbItemDataSubscriptions()
      for (const ttEntry of ttEntries) {
        this.subscribeForTtEntry(ttEntry)
      }
    })
  }

  private subscribeForTtEntry(ttEntry: TimeTrackedEntry) {
    if ( ! ttEntry.isTrackingNow ) {
      return
    }
    const node = ttEntry.timeTrackable as OryTreeNode
    const dbItem = node.dbItem
    // TODO: listen to changes of title?
    this.dbItemDataSubscriptions.push(dbItem.data$.subscribe(data => {
      columnDefs.estimatedTime.getValueFromItemData(data)
      const minutesEstimated = node.getMinutes(columnDefs.estimatedTime)
      const percentages = [
        50, /* `Middle`, { persistent: false } */
        75, /* `Time to start wrapping-up!` */
        100, /* `Should be finished!` */
        110, /* `You are getting in trouble` */
        120, /* `Stop this or re-schedule / re-plan` */
        130, /* `Seriously, something is wrong, You were supposed to finish` */
        150, /* `Whooa!` */
      ]
      ttEntry.cancelAllNotifications()
      for ( const percent of percentages ) {
        if (minutesEstimated > 0) {
          const msDuration = minutesEstimated * 60_000 * percent / 100
          const minutesLefToNotify = minutesEstimated * percent / 100
          console.log('PlanExecutionService minutes', minutesEstimated)
          ttEntry.notifyTrackedMsElapsedUntilPaused(msDuration, () => {
            const notificationTitle = '' + percent + `% ${minutesLefToNotify}m left - ` + node.getValueForColumn(columnDefs.title)
            console.log('notifyTrackedMsElapsed', node.getValueForColumn(columnDefs.title))
            const notification = new Notification(notificationTitle, { body: `Time to start wrapping-up!`, requireInteraction: true})
            // setTimeout(() => {notification.close()}, 3_000 )
            // TODO: show minutes left
            // TODO: react to dbItem's data$ changes
            // TODO: unsubscribe
          })
        }
      }
    }))
  }
  private cancelDbItemDataSubscriptions() {
    for ( const sub of this.dbItemDataSubscriptions ) {
      sub.unsubscribe()
    }
  }

}
