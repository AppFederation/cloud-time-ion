import {Injector} from "@angular/core";
import {OdmItemId} from "./OdmItemId";
import {OdmBackend} from "./OdmBackend";
import {CachedSubject} from "../utils/CachedSubject";

export abstract class OdmCollectionBackendListener<TInDb> {
  abstract onAdded(addedItemId: OdmItemId<TInDb>, addedItemData: TInDb)
  abstract onModified(modifiedItemId: OdmItemId<TInDb>, modifiedItemData: TInDb)
  abstract onRemoved(removedItemId: OdmItemId<TInDb>)
}


export abstract class OdmCollectionBackend<TInDb> {

  listener: OdmCollectionBackendListener<TInDb>

  collectionBackendReady$ = this.odmBackend.backendReady$

  dbCollection$ = new CachedSubject<TInDb[]>([])

  protected constructor(
    protected injector: Injector,
    protected className: string,
    protected odmBackend: OdmBackend,
  ) {
  }

  abstract saveNowToDb(item: TInDb, id: OdmItemId)

  abstract deleteWithoutConfirmation(itemId: OdmItemId)

  public setListener(listener: OdmCollectionBackendListener<TInDb>) {
    this.listener = listener
  }

}
