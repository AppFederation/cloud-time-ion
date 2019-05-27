import {Injector} from "@angular/core";
import {OdmCollectionBackend} from "./OdmCollectionBackend";
import {OdmItem} from "./OdmItem";
import {CachedSubject} from "../utils/CachedSubject";
import {OdmChildListDefinition} from "./OdmChildListDefinition";

export abstract class OdmBackend {

  backendReady$ = new CachedSubject<boolean>()

  protected constructor(
    protected injector: Injector,
  ) {
  }

  abstract createCollectionBackend<T extends OdmItem<T>>(injector: Injector, className: string): OdmCollectionBackend<T>

  abstract createManyToManyBackend(manyToManyDefinition: OdmChildListDefinition<any, any>)
}
