import {Injectable, Injector} from '@angular/core';
import {JournalEntry, JournalEntryId} from "../models/JournalEntry";
import {OdmService2} from '../../../libs/AppFedShared/odm/OdmService2'
import {JournalEntry$} from '../models/JournalEntry$'

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
  }

  protected convertFromDbFormat(dbItem: JournalEntry): JournalEntry {
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
