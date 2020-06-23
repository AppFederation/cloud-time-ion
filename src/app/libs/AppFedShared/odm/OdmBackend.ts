import {Injector} from "@angular/core";
import {OdmCollectionBackend} from "./OdmCollectionBackend";
import {OdmItem} from "./OdmItem";
import {CachedSubject} from "../utils/CachedSubject";


import * as firebase from 'firebase';

import Timestamp = firebase.firestore.Timestamp

export type OdmTimestamp = Timestamp

export abstract class OdmBackend {

  backendReady$ = new CachedSubject<boolean>()

  protected constructor(
    protected injector: Injector,
  ) {
  }

  abstract createCollectionBackend<T extends OdmItem<T>>(injector: Injector, className: string): OdmCollectionBackend<T>

  static nowTimestamp() {
    return Timestamp.now()
  }

}
