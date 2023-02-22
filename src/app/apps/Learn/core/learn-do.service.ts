import {Injectable, Injector} from '@angular/core';
import {OdmService2} from '../../../libs/AppFedShared/odm/OdmService2'
import {LearnItem, LearnItemId} from '../models/LearnItem'
import {OdmItem$2} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {OdmItemId} from '../../../libs/AppFedShared/odm/OdmItemId'
import {LearnItem$} from '../models/LearnItem$'

@Injectable({
  providedIn: 'root'
})
export class LearnDoService extends OdmService2<
    LearnDoService,
    LearnItem,
    LearnItem,
    LearnItem$
  > {

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

  convertFromDbFormat(dbItem: LearnItem): LearnItem {
    return Object.assign(new LearnItem(), dbItem)
  }

  protected createOdmItem$ForExisting(itemId: LearnItemId, inMemVal?: LearnItem): LearnItem$ {
    return new LearnItem$(this, itemId, inMemVal)
  }

  add(val?: LearnItem) {
    const learnItem$ = new LearnItem$(this, undefined, val ?? new LearnItem())
    learnItem$.saveNowToDb()
    return learnItem$
  }

  override createOdmItem$(id?: LearnItemId, inMemData?: LearnItem) {
    return new LearnItem$(this, id, inMemData)
  }

}
