import {OdmItem$2, OdmPatch} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {JournalEntry} from './JournalEntry'
import {JournalEntriesService} from '../core/journal-entries.service'
import {errorAlert, errorAlertAndThrow} from '../../../libs/AppFedShared/utils/log'

export class JournalEntry$ extends OdmItem$2<
  JournalEntry$,
  JournalEntry,
  JournalEntry,
  JournalEntriesService
  >
{

  patchThrottled(patch: OdmPatch<JournalEntry>) {
    // errorAlertAndThrow(`patchThrottled journal entry`)
    super.patchThrottled(patch);
  }
}
