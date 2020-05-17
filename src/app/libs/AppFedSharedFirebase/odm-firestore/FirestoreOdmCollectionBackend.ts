import {OdmCollectionBackend} from "../../AppFedShared/odm/OdmCollectionBackend";
import {Injectable, Injector} from "@angular/core";
import {AngularFirestore, DocumentChange, QuerySnapshot} from "@angular/fire/firestore";
import {OdmItemId} from "../../AppFedShared/odm/OdmItemId";
import {OdmItem} from "../../AppFedShared/odm/OdmItem";
import {ignorePromise} from "../../AppFedShared/utils/promiseUtils";
import {OdmBackend} from "../../AppFedShared/odm/OdmBackend";
import {CachedSubject} from "../../AppFedShared/utils/CachedSubject";
import {debugLog} from "../../AppFedShared/utils/log";


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
        this.dbCollection$.nextWithCache(coll as T[])
      })
    })
  }

  deleteWithoutConfirmation(itemId: OdmItemId) {
    ignorePromise(this.itemDoc(itemId).delete())
  }

  saveNowToDb(item: T): Promise<any> {
    debugLog('FirestoreOdmCollectionBackend saveNowToDb', item)
    return this.itemDoc(item.id).set(item.toDbFormat())
    // FIXME: update() to patch

    // https://firebase.google.com/docs/firestore/query-data/listen#events-local-changes
    /* Retrieved documents have a metadata.hasPendingWrites property that indicates whether the document has local changes that haven't been written to the backend yet.
      You can use this property to determine the source of events received by your snapshot listener: */
  }

  private collection() {
    return this.angularFirestore.collection(this.collectionName);
  }

  private itemDoc(itemId: OdmItemId) {
    return this.collection().doc(itemId)
  }

}
