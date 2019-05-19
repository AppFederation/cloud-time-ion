import {Injector} from "@angular/core";
import {OdmItemId} from "./OdmItemId";
import {OdmBackend} from "./OdmBackend";
import {CachedSubject} from "../utils/CachedSubject";
import {OdmItem} from "./OdmItem";

export abstract class OdmCollectionBackendListener<T extends OdmItem<T>, TRaw = T> {
  abstract onAdded(addedItemId: OdmItemId<T>, addedItemData: T)
  abstract onModified(modifiedItemId: OdmItemId<T>, modifiedItemData: T)
  abstract onRemoved(removedItemId: OdmItemId<T>)
}


export abstract class OdmCollectionBackend<T extends OdmItem<T>, TRaw = T> {

  listener: OdmCollectionBackendListener<T>

  collectionBackendReady$ = this.odmBackend.backendReady$

  dbCollection$ = new CachedSubject<T[]>([])

  protected constructor(
    protected injector: Injector,
    protected className: string,
    protected odmBackend: OdmBackend,
  ) {
  }

  abstract saveNowToDb(item: T)

  abstract deleteWithoutConfirmation(itemId: OdmItemId)

  public setListener(listener: OdmCollectionBackendListener<T>) {
    this.listener = listener
  }

}
