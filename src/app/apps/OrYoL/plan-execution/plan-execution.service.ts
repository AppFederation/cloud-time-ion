import { Injectable } from '@angular/core';
import {
  TimeTrackingService,
} from '../time-tracking/time-tracking.service'
import { columnDefs } from '../tree-shared/node-content/Columns'
import { Subscription } from 'rxjs'
import {minutesToString, parseTimeToMinutes} from '../utils/time-utils'
import { ConfigService } from '../core/config.service'

import {OryBaseTreeNode} from '../tree-model/TreeModel'
import {TreeTableNodeContent} from '../tree-model/TreeTableNodeContent'
import {OryItem$} from '../db/OryItem$'
import {TimeTrackedEntry} from '../time-tracking/TimeTrackedEntry'

@Injectable({
  providedIn: 'root'
})
export class PlanExecutionService {
  private dbItemDataSubscriptions: Subscription[] = []
  private currentlyTrackedEntries: TimeTrackedEntry[] = []

  notificationsEnabled = true

  constructor(
    private timeTrackingService: TimeTrackingService,
    private configService: ConfigService,
  ) {
    this.configService.config$.subscribe(config => {
      this.notificationsEnabled = config.planExecutionNotificationsEnabled
      // console.log(`PlanExecutionService config$`, config)
      this.reset()
    })
    this.timeTrackingService.timeTrackedEntries$.subscribe((newTtEntries: TimeTrackedEntry[]) => {
      // console.log(`PlanExecutionService timeTrackedEntries$`, newTtEntries)
      this.onEntriesChanged(newTtEntries)
    })
  }

  private onEntriesChanged(newTtEntries: TimeTrackedEntry[]) {
    Notification.requestPermission(() => {
    }).then(() => {
    })
    this.cancelAllNotifications()
    this.cancelDbItemDataSubscriptions()

    this.currentlyTrackedEntries = newTtEntries

    if ( this.notificationsEnabled ) {
      for (const ttEntry of this.currentlyTrackedEntries) {
        if ( ttEntry.isTrackingNow ) {
          this.subscribeForTtEntry(ttEntry)
        }
      }
    }
  }

  private reset() {
    this.onEntriesChanged(this.currentlyTrackedEntries)
  }


  private cancelAllNotifications() {
    for (const curTrackedEntry of this.currentlyTrackedEntries) {
      curTrackedEntry.cancelAllNotifications()
    }
  }

  private subscribeForTtEntry(ttEntry: TimeTrackedEntry) {
    if ( ! ttEntry.isTrackingNow ) {
      return
    }
    // const node = (ttEntry.timeTrackable as TreeTableNodeContent).treeNode
    console.log(`subscribeForTtEntry`, `ttEntry`, ttEntry)
    // const dbItem = node.content.dbItem
    const dbItem = ttEntry.timeTrackable as OryItem$
    // TODO: listen to changes of title?
    this.dbItemDataSubscriptions.push(dbItem.data$.subscribe((data: any) => {
      this.onItemDataChanged(data, dbItem, ttEntry)
    }))
  }

  private onItemDataChanged(data: any, item$: OryItem$, ttEntry: TimeTrackedEntry) {
    if ( ttEntry.isTrackingNow ) {
      this.subscribeTimeoutsForPercentages(item$, ttEntry)
    }
  }

  private subscribeTimeoutsForPercentages(item$: OryItem$, ttEntry: TimeTrackedEntry) {
    // columnDefs.estimatedTime.getValueFromItemData(data)
    // const minutesEstimated = node.content.getMinutes(columnDefs.estimatedTime)
    const minutesEstimated = parseTimeToMinutes(item$.data$.lastVal.estimatedTime) || 0
    const percentages = [
      50, /* `Middle`, { persistent: false } */
      75, /* `Time to start wrapping-up!` */
      90, /* `Time to start wrapping-up!` */
      95, /* `Time to start wrapping-up!` */
      100, /* `Should be finished!` */
      // 105, /* `Should be finished!` */
      110, /* `You are getting in trouble` */
      // 120, /* `Stop this or re-schedule / re-plan` */
      130, /* `Seriously, something is wrong, You were supposed to finish` */
      // 150, /* `Whooa!` */
      // 160, /* `Whooa!` */
      170, /* `Whooa!` */
      180, /* `Whooa!` */
      190, /* `Whooa!` */
      200, /* `Whooa!` */
      300, /* `Whooa!` */
      400, /* `Whooa!` */
      500, /* `Whooa!` */
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
          const notificationTitle = '' + percent + `% | ${minutesLefToNotifyString} ${leftOrOvertime} - ` + item$.data$.lastVal.title
          console.log('notifyTrackedMsElapsed', item$.data$.lastVal.title)
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
