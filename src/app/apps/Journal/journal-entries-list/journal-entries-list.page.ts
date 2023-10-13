import {Component, Injector, OnInit} from '@angular/core';
import {JournalEntryItemsService} from '../core/journal-entries.service'
import {JournalEntry$} from '../models/JournalEntry$'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {of} from 'rxjs'
import {combineLatest} from 'rxjs'
import {debugLog} from '../../../libs/AppFedShared/utils/log'
import {JournalEntry} from '../models/JournalEntry'
import {ListOptionsComponent} from '../../Learn/search-or-add-learnable-item/list-options/list-options.component'
import {PopoverController} from '@ionic/angular'
import {LocalOptionsPatchableObservable} from '../../Learn/core/options.service'
import {ListOptionsData} from '../../Learn/search-or-add-learnable-item/list-options'
import {TimelineListOptionsComponent} from './timeline-list-options/timeline-list-options.component'
import {BaseComponent} from '../../../libs/AppFedShared/base/base.component'

export class TimelineListOptionsData {
  sortAscending ? : boolean
}

@Component({
  selector: 'app-journal-entries-list',
  templateUrl: './journal-entries-list.page.html',
  styleUrls: ['./journal-entries-list.page.sass'],
})
export class JournalEntriesListPage extends BaseComponent implements OnInit {

  useVirtualScroll = true

  listOptions$P = new LocalOptionsPatchableObservable<TimelineListOptionsData>({
      sortAscending: false
    },
    'TimelineList_Options'
  )

  // itemsTest$ = of(    Array(100).fill(0).map((val) => {
  //     return 'test'+val
  //   })
  // ).pipe(delay(3000))

  items$: CachedSubject<JournalEntry$[]> = this.journalEntriesService.localItems$
  // itemsHack ? : JournalEntry$[]
  items$Sorted = combineLatest(this.listOptions$P.val$, this.items$, (options, item$s) => {
      return item$s
        // .filter(x => (x.val?.importance?.numVal ?? 0) > 7)
        .sort((item$1, item$2) => {
          const number = ((item$2.val?.whenCreated ?? (item$2.val as any)?.whenAdded)?.toDate().getTime() ?? 0) -
            ((item$1.val?.whenCreated ?? (item$1.val as any)?.whenAdded)?.toDate().getTime() ?? 0)
          return options.sortAscending ? number : -number
        })
    })

  constructor(
    public journalEntriesService: JournalEntryItemsService,
    public popoverController: PopoverController,
    injector: Injector,
  ) {
    super(injector)
    this.listOptions$P.val$.subscribe(x => {
      console.log(`listOptions$P`, x)
    })
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

  async onClickListOptions(event: any) {
    const popover = await this.popoverController.create({
      component: TimelineListOptionsComponent,
      componentProps: {
        listOptions$P: this.listOptions$P
      },
      event: event,
      translucent: true,
      mode: 'ios',
      cssClass: `my-popover`,
    });
    return await popover.present();
  }
}
