import {
  EventEmitter,
  Injectable,
} from '@angular/core';
import { HasItemData } from '../tree-model/has-item-data'
import { Subject } from 'rxjs'
import {OryItem$} from '../db/OryItem$'

@Injectable({
  providedIn: 'root'
})
export class OryItemsService {

  isApplyingFromDbNow = false

  public readonly onItemWithDataAdded$ = new Subject<OryItem$>()

  /* FIXME impl */
  // public readonly onItemWithDataModified = new Subject<HasItemData>()
  public readonly onItemAddedOrModified$ = new Subject<OryItem$>()

  public readonly onItemWithDataPatchedByUserLocally$ = new Subject<[OryItem$, any /* FIXME specify if this is patch or end value */]>()

  constructor() { }
}
