import {OdmCollectionBackend} from "../odm/OdmCollectionBackend";
import {Injectable, Injector} from "@angular/core";
import {AngularFirestore} from "@angular/fire/firestore";
import {OdmItemId} from "../odm/OdmItemId";
import {OdmItem} from "../odm/OdmItem";
import {ignorePromise} from "../utils/promiseUtils";
import {OdmBackend} from "../odm/OdmBackend";
import {CachedSubject} from "../utils/CachedSubject";

@Injectable()
export class FirestoreOdmCollectionBackend<T extends OdmItem<T>> extends OdmCollectionBackend<T> {

  protected angularFirestore = this.injector.get(AngularFirestore)

  constructor(
    injector: Injector,
    className: string,
    odmBackend: OdmBackend,
  ) {
    super(injector, className, odmBackend)
    this.collectionBackendReady$.subscribe(() => {
      this.collection().valueChanges().subscribe(coll => {
        this.dbCollection$.next(coll as T[])
      })
    })
  }

  deleteWithoutConfirmation(itemId: OdmItemId) {
    ignorePromise(this.itemDoc(itemId).delete())
  }

  saveNow(item: T) {
    ignorePromise(this.itemDoc(item.id).set(item.toDbFormat()))
  }

  private collection() {
    return this.angularFirestore.collection(this.className);
  }

  private itemDoc(itemId: OdmItemId) {
    return this.collection().doc(itemId)
  }

}
