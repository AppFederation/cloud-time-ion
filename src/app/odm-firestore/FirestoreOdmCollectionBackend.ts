import {OdmCollectionBackend} from "../odm/OdmCollectionBackend";
import {Injectable, Injector} from "@angular/core";
import {AngularFirestore, DocumentChange, QuerySnapshot} from "@angular/fire/firestore";
import {OdmItemId} from "../odm/OdmItemId";
import {OdmItem} from "../odm/OdmItem";
import {ignorePromise} from "../utils/promiseUtils";
import {OdmBackend} from "../odm/OdmBackend";
import {CachedSubject} from "../utils/CachedSubject";
import {debugLog} from "../utils/log";


export class FirestoreOdmCollectionBackend<T extends OdmItem<T>, TRaw = T> extends OdmCollectionBackend<T> {

  protected angularFirestore = this.injector.get(AngularFirestore)

  public collectionName = this.className;

  constructor(
    injector: Injector,
    className: string,
    odmBackend: OdmBackend,
  ) {
    super(injector, className, odmBackend)
    this.collectionBackendReady$.subscribe(() => {
      this.angularFirestore.firestore.collection(this.collectionName).onSnapshot((snapshot: QuerySnapshot<T>) => {
        for ( let change of snapshot.docChanges() ) {
          if ( change.type === 'added' ) {
            this.listener.onAdded(change.doc.id, change.doc.data() as T)
          } else if ( change.type === 'modified') {
            this.listener.onModified(change.doc.id, change.doc.data() as T)
          } else if ( change.type === 'removed') {
            this.listener.onRemoved(change.doc.id)
          }
        }

      })
      this.collection().valueChanges().subscribe(coll => {
        this.dbCollection$.next(coll as T[])
      })
    })
  }

  deleteWithoutConfirmation(itemId: OdmItemId) {
    ignorePromise(this.itemDoc(itemId).delete())
  }

  saveNowToDb(item: T) {
    debugLog('FirestoreOdmCollectionBackend saveNowToDb', item)
    ignorePromise(this.itemDoc(item.id).set(item.toDbFormat()))
  }

  private collection() {
    return this.angularFirestore.collection(this.collectionName);
  }

  private itemDoc(itemId: OdmItemId) {
    return this.collection().doc(itemId)
  }

}
