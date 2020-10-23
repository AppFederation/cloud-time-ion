import { Component, OnInit } from '@angular/core';
import {JournalEntriesService} from '../core/journal-entries.service'
import {JournalEntry$} from '../models/JournalEntry$'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {of} from 'rxjs'
import {delay, map} from 'rxjs/operators'
import {debugLog} from '../../../libs/AppFedShared/utils/log'
import {JournalEntry} from '../models/JournalEntry'

@Component({
  selector: 'app-journal-entries-list',
  templateUrl: './journal-entries-list.page.html',
  styleUrls: ['./journal-entries-list.page.sass'],
})
export class JournalEntriesListPage implements OnInit {

  useVirtualScroll = false

  // itemsTest$ = of(    Array(100).fill(0).map((val) => {
  //     return 'test'+val
  //   })
  // ).pipe(delay(3000))

  items$: CachedSubject<JournalEntry$[]> = this.journalEntriesService.localItems$
  // itemsHack ? : JournalEntry$[]
  items$Sorted = this.items$.pipe(
    map((item$s: JournalEntry$[]) => {
      return item$s.sort((item$1, item$2) => {
        return ((item$2.val?.whenCreated ?? (item$2.val as any)?.whenAdded)?.toDate().getTime() ?? 0) -
          ((item$1.val?.whenCreated ?? (item$1.val as any)?.whenAdded)?.toDate().getTime() ?? 0)
      })
    })
  )

  constructor(
    public journalEntriesService: JournalEntriesService,
  ) {
    // this.items$.subscribe(val => {
    //   this.itemsHack = val.slice(0, 20)
    //   // debugLog(`this.items$.subscribe(val => {`, val)
    //
    // })
  }

  ngOnInit() {
  }

  trackById(index: number, item: JournalEntry$) {
    return item.id
  }

}
