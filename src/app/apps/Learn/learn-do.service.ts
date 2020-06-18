import {Injectable, Injector} from '@angular/core';
import {OdmService} from '../../libs/AppFedShared/odm/OdmService'
import {LearnItem} from './search-or-add-learnable-item/search-or-add-learnable-item.page'

@Injectable({
  providedIn: 'root'
})
export class LearnDoService extends OdmService<LearnItem> {

  constructor(
    injector: Injector,
  ) {
    super(
      injector,
      'LearnItem'
    )
    console.log(`this.odmCollectionBackend`, this.odmCollectionBackend)
  }

}
