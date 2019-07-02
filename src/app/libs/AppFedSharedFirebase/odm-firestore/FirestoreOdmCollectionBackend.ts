import {OdmCollectionBackend} from "../../AppFedShared/odm/OdmCollectionBackend";
import {Injectable, Injector} from "@angular/core";
import {AngularFirestore, DocumentChange, QuerySnapshot} from "@angular/fire/firestore";
import {OdmItemId} from "../../AppFedShared/odm/OdmItemId";
import {OdmItem} from "../../AppFedShared/odm/OdmItem";
import {ignorePromise} from "../../AppFedShared/utils/promiseUtils";
import {OdmBackend} from "../../AppFedShared/odm/OdmBackend";
import {CachedSubject} from "../../AppFedShared/utils/CachedSubject";
import {debugLog} from "../../AppFedShared/utils/log";


export class FirestoreOdmCollectionBackend<TDbItem> extends OdmCollectionBackend<T> {

  protected angularFirestore = this.injector.get(AngularFirestore)

  public collectionName = this.className;

  constructor(
    injector: Injector,
    className: string,
    odmBackend: OdmBackend,
  ) {
    super(injector, className, odmBackend)
    this.collectionBackendReady$.subscribe(() => {
      this.angularFirestore.firestore.collection(this.collectionName).onSnapshot((snapshot: QuerySnapshot<TDbItem>) => {
        for ( let change of snapshot.docChanges() ) {
          if ( change.type === 'added' ) {
            this.listener.onAdded(change.doc.id, change.doc.data() as TDbItem)
          } else if ( change.type === 'modified') {
            this.listener.onModified(change.doc.id, change.doc.data() as TDbItem)
          } else if ( change.type === 'removed') {
            this.listener.onRemoved(change.doc.id)
          }
        }

      })
      this.collection().valueChanges().subscribe(coll => {
        this.dbCollection$.nextWithCache(coll as TDbItem[])
      })
    })
  }

  deleteWithoutConfirmation(itemId: OdmItemId) {
    ignorePromise(this.itemDoc(itemId).delete())
  }

  saveNowToDb(item: TDbItem, id) {
    debugLog('FirestoreOdmCollectionBackend saveNowToDb', item)
    ignorePromise(this.itemDoc(id).set(item.toDbFormat()))
  }

  private collection() {
    return this.angularFirestore.collection(this.collectionName);
  }

  private itemDoc(itemId: OdmItemId) {
    return this.collection().doc(itemId)
  }

}
