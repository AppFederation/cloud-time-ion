import {Injectable, Injector} from '@angular/core';
import {JournalEntry, JournalEntryId} from "../models/JournalEntry";
import {OdmService2} from '../../../libs/AppFedShared/odm/OdmService2'
import {JournalEntry$} from '../models/JournalEntry$'
import {LearnItem} from '../../Learn/models/LearnItem'

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
}
