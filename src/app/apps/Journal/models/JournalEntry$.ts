import {OdmItem$2, OdmPatch} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {JournalEntry} from './JournalEntry'
import {JournalEntriesService} from '../core/journal-entries.service'
import {errorAlert, errorAlertAndThrow} from '../../../libs/AppFedShared/utils/log'
import {OdmTimestamp} from '../../../libs/AppFedShared/odm/OdmBackend'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'

export class JournalEntry$ extends OdmItem$2<
  JournalEntry$,
  JournalEntry,
  JournalEntry,
  JournalEntriesService
  >
{
  val$WithWhenCreated: Observable<(JournalEntry & { whenCreated: OdmTimestamp }) | undefined | null> | undefined
    = this.val$.pipe(map(val => {
    const dateFromId = this.id !
      .replace(/JournalEntry__/g, '')
      .replace(/__/g, ' ')
      .replace(/_/g, ' ')
      .replace(/Z_/g, 'Z')
      .replace(/\./, ':')
      .replace(/\./, ':')
    console.log(dateFromId)
    const ret = {
        ...val,
        whenCreated: {
          toDate: () => new Date(dateFromId
          )
        }
      }
      return ret as any
    }
  ))

  patchThrottled(patch: OdmPatch<JournalEntry>) {
    // errorAlertAndThrow(`patchThrottled journal entry`)
    super.patchThrottled(patch);
  }
}
