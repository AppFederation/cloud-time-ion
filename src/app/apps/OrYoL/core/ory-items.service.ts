import {
  EventEmitter,
  Injectable,
} from '@angular/core';
import { HasItemData } from '../tree-model/has-item-data'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class OryItemsService {

  isApplyingFromDbNow = false

  public readonly onItemWithDataAdded$ = new Subject<HasItemData>()

  /* FIXME impl */
  // public readonly onItemWithDataModified = new Subject<HasItemData>()
  public readonly onItemAddedOrModified$ = new Subject<HasItemData>()

  public readonly onItemWithDataPatchedByUserLocally$ = new Subject<[HasItemData, any]>()

  constructor() { }
}
