import {Injectable, Injector} from '@angular/core';
import {OdmService} from "../../../libs/AppFedShared/odm/OdmService";
import {JournalEntry} from "./JournalEntry";

@Injectable({
  providedIn: 'root'
})
export class JournalEntriesService extends OdmService<JournalEntry> {

  constructor(
    injector: Injector,
  ) {
    super(
      injector,
      'JournalEntry'
    )
  }
}
