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

  public override convertFromDbFormat(dbItem: GenericItem): GenericItem {
    return Object.assign(new GenericItem(), dbItem)
  }

  protected createOdmItem$ForExisting(itemId: GenericItemId, inMemVal?: GenericItem): GenericItem$ {
    return new GenericItem$(this, itemId, inMemVal)
  }

  /** TODO de-duplicate with base service func; rename to addAndSave() */
  add(val?: GenericItem) {
    const item$ = this.createOdmItem$(undefined, val)
    item$.saveNowToDb()
    return item$
  }

  override createOdmItem$(id?: GenericItemId, inMemData?: GenericItem, parents?: GenericItem$[]): GenericItem$ {
    // TODO: I wrote this when tired, to fix mic component. Re-check.
    return new GenericItem$(this, undefined, inMemData, parents);
  }

}
