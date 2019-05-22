import {Injector} from "@angular/core";
import {OdmCollectionBackend} from "./OdmCollectionBackend";
import {OdmItem} from "./OdmItem";
import {CachedSubject} from "../utils/CachedSubject";

export abstract class OdmBackend {

  backendReady$ = new CachedSubject<boolean>()

  protected constructor(
    protected injector: Injector,
  ) {
  }

  abstract createCollectionBackend<T extends OdmItem<T>>(injector: Injector, className: string): OdmCollectionBackend<T>

}
