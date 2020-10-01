import { Component, OnInit } from '@angular/core';
import {JournalEntriesService} from '../core/journal-entries.service'
import {JournalEntry$} from '../models/JournalEntry$'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {of} from 'rxjs/internal/observable/of'
import {delay} from 'rxjs/operators'
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
