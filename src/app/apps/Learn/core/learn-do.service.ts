import {Injectable, Injector} from '@angular/core';
import {OdmService2} from '../../../libs/AppFedShared/odm/OdmService2'
import {LearnItem, LearnItem$} from '../models/LearnItem'
import {OdmItem$2} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {OdmItemId} from '../../../libs/AppFedShared/odm/OdmItemId'

@Injectable({
  providedIn: 'root'
})
export class LearnDoService extends OdmService2<LearnItem, LearnItem, LearnItem$> {

  constructor(
    injector: Injector,
  ) {
    super(
      injector,
      'LearnItem'
    )
    // console.log(`this.odmCollectionBackend`, this.odmCollectionBackend)
    // this.localItems$.subscribe(items => {
    //   console.log(`LearnDoService items.length`, items.length)
    // })
  }

  protected convertFromDbFormat(dbItem: LearnItem): LearnItem {
    return Object.assign(new LearnItem(), dbItem)
  }

  protected createOdmItem$ForExisting(itemId: OdmItemId<LearnItem>, inMemVal?: LearnItem): LearnItem$ {
    return new LearnItem$(this, itemId, inMemVal)
  }

}
