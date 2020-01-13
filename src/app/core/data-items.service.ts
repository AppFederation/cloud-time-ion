import {
  EventEmitter,
  Injectable,
} from '@angular/core';
import { HasItemData } from '../tree-model/has-item-data'
import { Subject } from 'rxjs/Subject'

@Injectable({
  providedIn: 'root'
})
export class DataItemsService {

  public readonly onItemWithDataAdded$ = new Subject<HasItemData>()

  constructor() { }
}
