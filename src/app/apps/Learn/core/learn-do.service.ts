import {Injectable, Injector} from '@angular/core';
import {OdmService2} from '../../../libs/AppFedShared/odm/OdmService2'
import {LearnItem, LearnItemId} from '../models/LearnItem'
import {OdmItem$2, OdmItem$2CtorOpts} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {OdmItemId} from '../../../libs/AppFedShared/odm/OdmItemId'
import {LearnItem$} from '../models/LearnItem$'
import {MigrateImgBase64Service} from './migrate-img-base64'

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
    // public migrate: MigrateImgBase64Service,
  ) {
    super(
      injector,
      'LearnItem'
    )
    // this.migrate.processLearnItems()


    // console.log(`this.odmCollectionBackend`, this.odmCollectionBackend)
    // this.localItems$.subscribe(items => {
    //   console.log(`LearnDoService items.length`, items.length)
    // })
  }

  override convertFromDbFormat(dbItem: LearnItem): LearnItem {
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

  override createOdmItem$(id?: LearnItemId, inMemData?: LearnItem, parents?: LearnItem$[], opts?: OdmItem$2CtorOpts) {
    return new LearnItem$(this, id, inMemData, parents, opts)
  }

}
