import {OdmBackend} from "../odm/OdmBackend";
import {FirestoreOdmCollectionBackend} from "./FirestoreOdmCollectionBackend";
import {Injectable, Injector} from "@angular/core";
import {debugLog, errorAlert} from "../utils/log";
import {AngularFirestore} from "@angular/fire/firestore";
import {OdmItem} from "../odm/OdmItem";

@Injectable()
export class FirestoreOdmBackend extends OdmBackend {

  constructor(
    protected injector: Injector,
    protected angularFirestore: AngularFirestore
  ) {
    super(injector)
    this.initDb()
  }

  createCollectionBackend<T extends OdmItem<T>>(injector: Injector, className: string) {
    return new FirestoreOdmCollectionBackend<T>(injector, className, this)
  }

  protected initDb() {
    this.angularFirestore.firestore.enablePersistence().then(() => {
      // window.alert('persistence enabled')
      debugLog('Firestore persistence enabled')
      this.backendReady$.next(true)
    }).catch((caught) => {
      errorAlert('Firestore enablePersistence error', caught)
    })
  }
}
