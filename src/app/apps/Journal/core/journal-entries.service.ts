import {Injectable, Injector} from '@angular/core';
import {OdmService} from "../../../libs/AppFedShared/odm/OdmService";
import {JournalEntry} from "../models/JournalEntry";
import {OdmService2} from '../../../libs/AppFedShared/odm/OdmService2'
import {JournalEntry$} from '../models/JournalEntry$'
import {OdmItemId} from '../../../libs/AppFedShared/odm/OdmItemId'

@Injectable({
  providedIn: 'root'
})
export class JournalEntriesService extends OdmService2<
  JournalEntriesService,
  JournalEntry,
  JournalEntry,
  JournalEntry$
  > {

  constructor(
    injector: Injector,
  ) {
    super(
      injector,
      'JournalEntry'
    )
  }

  protected createOdmItem$ForExisting(itemId: OdmItemId<JournalEntry>, inMemVal: JournalEntry | undefined): JournalEntry$ {
    return new JournalEntry$(this, itemId, inMemVal);
  }
}
