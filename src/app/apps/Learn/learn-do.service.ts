import {Injectable, Injector} from '@angular/core';
import {OdmService} from '../../libs/AppFedShared/odm/OdmService'
import {LearnItem} from './search-or-add-learnable-item/search-or-add-learnable-item.page'
import {OdmService2} from '../../libs/AppFedShared/odm/OdmService2'

@Injectable({
  providedIn: 'root'
})
export class LearnDoService extends OdmService2<LearnItem> {

  constructor(
    injector: Injector,
  ) {
    super(
      injector,
      'LearnItem'
    )
    console.log(`this.odmCollectionBackend`, this.odmCollectionBackend)
    this.localItems$.subscribe(items => {
      console.log(`LearnDoService items.length`, items.length)
    })
  }

}
