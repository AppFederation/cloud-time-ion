import { Injectable } from '@angular/core';
import {
  TimeTrackedEntry,
  TimeTrackingService,
} from '../time-tracking/time-tracking.service'
import { OryTreeNode } from '../tree-model/TreeModel'
import { columnDefs } from '../tree-shared/node-content/Columns'
import { Subscription } from 'rxjs'
import { minutesToString } from '../utils/time-utils'

@Injectable({
  providedIn: 'root'
})
export class PlanExecutionService {
  private dbItemDataSubscriptions: Subscription[] = []
  private currentlyTrackedEntries: TimeTrackedEntry[] = []

  constructor(
    private timeTrackingService: TimeTrackingService,
  ) {
    this.timeTrackingService.timeTrackedEntry$.subscribe(ttEntryNotified => {
      Notification.requestPermission(() => {}).then(() => {
      })
      for ( const curTrackedEntry of this.currentlyTrackedEntries ) {
        curTrackedEntry.cancelAllNotifications()
      }
      this.currentlyTrackedEntries = [ ttEntryNotified /* emulate multi-time-tracking */ ]
      this.cancelDbItemDataSubscriptions()

      for (const ttEntry of this.currentlyTrackedEntries) {
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
      this.onItemDataChanged(data, node, ttEntry)
    }))
  }

  private onItemDataChanged(data, node: OryTreeNode, ttEntry: TimeTrackedEntry) {
    if ( ttEntry.isTrackingNow ) {
      this.subscribeTimeoutsForPercentages(node, ttEntry)
    }
  }

  private subscribeTimeoutsForPercentages(node: OryTreeNode, ttEntry: TimeTrackedEntry) {
    // columnDefs.estimatedTime.getValueFromItemData(data)
    const minutesEstimated = node.getMinutes(columnDefs.estimatedTime)
    const percentages = [
      50, /* `Middle`, { persistent: false } */
      75, /* `Time to start wrapping-up!` */
      90, /* `Time to start wrapping-up!` */
      95, /* `Time to start wrapping-up!` */
      100, /* `Should be finished!` */
      105, /* `Should be finished!` */
      110, /* `You are getting in trouble` */
      120, /* `Stop this or re-schedule / re-plan` */
      130, /* `Seriously, something is wrong, You were supposed to finish` */
      150, /* `Whooa!` */
      160, /* `Whooa!` */
      170, /* `Whooa!` */
      180, /* `Whooa!` */
      190, /* `Whooa!` */
      200, /* `Whooa!` */
    ]
    ttEntry.cancelAllNotifications()
    for (const percent of percentages) {
      if (minutesEstimated > 0) {
        const msDuration = minutesEstimated * 60_000 * percent / 100
        const minutesPassed = minutesEstimated * percent / 100
        const minutesLefToNotify = minutesEstimated - minutesPassed
        const minutesLefToNotifyString = minutesToString(Math.abs(minutesLefToNotify))
        const leftOrOvertime = (minutesLefToNotify >= 0) ? 'left' : 'OVERTIME'
        console.log('PlanExecutionService minutes', minutesEstimated)
        ttEntry.notifyTrackedMsElapsedUntilPaused(msDuration, () => {
          /* This should probably be done by https://www.chromestory.com/2019/07/new-chrome-api-to-support-scheduling-future-notifications/
            https://web.dev/notification-triggers/
            https://www.chromestatus.com/feature/5133150283890688
            and/or via Capacitor and/or my own service
          */
          const notificationTitle = '' + percent + `% | ${minutesLefToNotifyString} ${leftOrOvertime} - ` + node.getValueForColumn(columnDefs.title)
          console.log('notifyTrackedMsElapsed', node.getValueForColumn(columnDefs.title))
          const notification = new Notification(notificationTitle, {
            body: `Time to start wrapping-up!`,
            requireInteraction: true,
          })
          // setTimeout(() => {notification.close()}, 3_000 )
          // TODO: show minutes left
          // TODO: react to dbItem's data$ changes
          // TODO: unsubscribe
        })
      }
    }
  }

  private cancelDbItemDataSubscriptions() {
    for ( const sub of this.dbItemDataSubscriptions ) {
      sub.unsubscribe()
    }
  }

}
