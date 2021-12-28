import {Injectable, Injector} from '@angular/core';
import {OdmService2} from '../../../libs/AppFedShared/odm/OdmService2'
import {GenericItem, GenericItemId} from './GenericItem'
import {GenericItem$} from './GenericItem$'

@Injectable({
  providedIn: 'root'
})
export class GenericItemsService extends OdmService2<
    GenericItemsService,
    GenericItem,
    GenericItem,
    GenericItem$
  > {

  constructor(
    injector: Injector,
  ) {
    super(
      injector,
      'GenericItem' // FIXME: 'GenericItem'
    )
    // console.log(`this.odmCollectionBackend`, this.odmCollectionBackend)
    // this.localItems$.subscribe(items => {
    //   console.log(`LearnDoService items.length`, items.length)
    // })
  }

  public convertFromDbFormat(dbItem: GenericItem): GenericItem {
    return Object.assign(new GenericItem(), dbItem)
  }

  protected createOdmItem$ForExisting(itemId: GenericItemId, inMemVal?: GenericItem): GenericItem$ {
    return new GenericItem$(this, itemId, inMemVal)
  }

  add(val?: GenericItem) {
    const item$ = new GenericItem$(this, undefined, val ?? new GenericItem())
    item$.saveNowToDb()
    return item$
  }

}
