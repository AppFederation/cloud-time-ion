import {Injector} from "@angular/core";
import {OdmCollectionBackend} from "./OdmCollectionBackend";
// import {CachedSubject} from "../utils/CachedSubject2";


// import * as firebase from 'firebase';

// import Timestamp = firebase.firestore.Timestamp
import {CachedSubject} from '../utils/cachedSubject2/CachedSubject2'
import {AuthService} from '../../../auth/auth.service'
import firebase from 'firebase/compat/app'
import Timestamp = firebase.firestore.Timestamp

export type OdmTimestamp = Timestamp

export abstract class OdmBackend {

  backendReady$ = new CachedSubject<boolean>()

  authService = this.injector.get(AuthService)

  protected constructor(
    protected injector: Injector,
  ) {
  }

  abstract createCollectionBackend<TRaw>(
    injector: Injector, className: string,
    opts: {dontStoreVersionHistory: boolean}
  ): OdmCollectionBackend<TRaw>

  static nowTimestamp() {
    return Timestamp.now()
  }

}
