import {Injectable, Injector} from '@angular/core';
import {JournalEntry, JournalEntryId} from "../models/JournalEntry";
import {OdmService2} from '../../../libs/AppFedShared/odm/OdmService2'
import {JournalEntry$} from '../models/JournalEntry$'
import {stripHtml} from '../../../libs/AppFedShared/utils/html-utils'

@Injectable({
  providedIn: 'root'
})
export class JournalEntriesService extends OdmService2<
  JournalEntriesService,
  JournalEntry,
  JournalEntry,
  JournalEntry$,
  JournalEntryId
  >
{

  constructor(
    injector: Injector,
  ) {
    super(
      injector,
      'JournalEntry'
    )
    // this.stats()
  }

  public stats() {
    this.localItems$.subscribe(items => {
      const mapWordToCount = new Map<string, number>()
      for ( let item of items ) {
        const words = stripHtml(item?.val?.general) ?. split(/\W/) ?? []
        // console.log('words', words)
        for ( let word of words ) {
          word = word . toLowerCase()
          const number = mapWordToCount.get(word) ?? 0
          mapWordToCount.set(word, number + 1)
        }
      }
      console.log([...mapWordToCount.entries()].sort((a,b) => b[1] - a[1]))
    })
  }

  override convertFromDbFormat(dbItem: JournalEntry): JournalEntry {
    return Object.assign(new JournalEntry(), dbItem)
  }

  protected createOdmItem$ForExisting(itemId: JournalEntryId, inMemVal: JournalEntry | undefined): JournalEntry$ {
    return new JournalEntry$(this, itemId, inMemVal);
  }

  add(userString: string) {
    const val = new JournalEntry()
    val.general = userString
    const journalEntry$ = new JournalEntry$(this, undefined, val)
    journalEntry$.saveNowToDb()
  }
}
