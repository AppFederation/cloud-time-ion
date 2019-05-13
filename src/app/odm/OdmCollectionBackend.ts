import {Injector} from "@angular/core";
import {OdmItemId} from "./OdmItemId";
import {OdmBackend} from "./OdmBackend";
import {CachedSubject} from "../utils/CachedSubject";

export abstract class OdmCollectionBackend<T> {

  collectionBackendReady$ = this.odmBackend.backendReady$

  dbCollection$ = new CachedSubject<T[]>([])

  protected constructor(
    protected injector: Injector,
    protected className: string,
    protected odmBackend: OdmBackend,
  ) {
  }

  abstract saveNow(item: T)

  abstract deleteWithoutConfirmation(itemId: OdmItemId)

}
