import {OdmCollectionBackend} from "../../AppFedShared/odm/OdmCollectionBackend";
import {Injectable, Injector} from "@angular/core";
import {AngularFirestore, DocumentChange, QuerySnapshot} from "@angular/fire/firestore";
import {OdmItemId} from "../../AppFedShared/odm/OdmItemId";
import {OdmItem} from "../../AppFedShared/odm/OdmItem";
import {ignorePromise} from "../../AppFedShared/utils/promiseUtils";
import {OdmBackend} from "../../AppFedShared/odm/OdmBackend";
import {debugLog, errorAlert} from "../../AppFedShared/utils/log";
import {isNotNullish} from '../../AppFedShared/utils/utils'


export class FirestoreOdmCollectionBackend<TRaw> extends OdmCollectionBackend<TRaw> {

  protected angularFirestore = this.injector.get(AngularFirestore)

  public collectionName = this.className;

  constructor(
    injector: Injector,
    className: string,
    odmBackend: OdmBackend,
    // listenToCollection = true,
  ) {
    super(injector, className, odmBackend)
    debugLog(`BEFORE this.collectionBackendReady$.subscribe(() => {`, this.collectionName)
    this.collectionBackendReady$.subscribe(() => {
      debugLog(`IN this.collectionBackendReady$.subscribe(() => {`, this.collectionName)

      // This could cause the race condition of items uninitialized when going from another route
      this.angularFirestore.firestore.collection(this.collectionName)
        .where('owner', '==', this.authService.authUser$.lastVal!.uid)
        .onSnapshot(((snapshot: QuerySnapshot<TRaw>) =>
        {
          // console.log('firestore.collection(this.collectionName).onSnapshot', 'snapshot.docChanges().length', snapshot.docChanges().length)
          // FIXME: let the service process in batch, for performance --> is this done now, thanks to onFinishedProcessing() ?
          for ( let change of snapshot.docChanges() ) {
            const docId = change.doc.id
            const docData = change.doc.data()
            // this.setOwnerIfNeeded(docData, docId)
            if ( change.type === 'added' ) {
              this.listener?.onAdded(docId, docData as TRaw)
            } else if ( change.type === 'modified') {
              this.listener?.onModified(docId, docData as TRaw)
            } else if ( change.type === 'removed') {
              this.listener?.onRemoved(docId)
            }
          }
        this.listener?.onFinishedProcessingChangeSet()

        // FIXME: only emit after processing finished

      }) as any /* workaround after strict settings */)
      // this.collection().valueChanges().subscribe((coll: TRaw[]) => {
      //   this.dbCollection$.nextWithCache(coll)
      // })
    })
  }

  private setOwnerIfNeeded(docData: firebase.firestore.DocumentData, docId: string) {
    if (this.collectionName === `JournalEntry`) {
      const existingOwner = docData?.owner
      const karolOwner = `7Tbg0SwakaVoCXHlu1rniHQ6gwz1`
      if (!existingOwner) {
        debugLog(this.collectionName + ` no owner `, existingOwner, docId)
        this.itemDoc(docId).update({owner: karolOwner}).then(() => {
          debugLog(`finished updating owner`, docId)
        })
      } else {
        // debugLog(this.collectionName + ` yes owner `, docId, existingOwner)
        if (existingOwner !== karolOwner) {
          errorAlert(`some other owner!!`, `docId:`, docId, `owner: `, existingOwner)
        }
      }
    }
  }

  deleteWithoutConfirmation(itemId: OdmItemId) {
    ignorePromise(this.itemDoc(itemId).delete())
  }

  saveNowToDb(item: TRaw, id: string): Promise<any> {
    if ( ! isNotNullish(id) ) {
      errorAlert('id cannot be ' + id)
    }
    // debugLog('FirestoreOdmCollectionBackend saveNowToDb', item)
    return this.itemDoc(id).set(item/*.toDbFormat()*/)
    // FIXME: update() to patch

    // https://firebase.google.com/docs/firestore/query-data/listen#events-local-changes
    /* Retrieved documents have a metadata.hasPendingWrites property that indicates whether the document has local changes that haven't been written to the backend yet.
      You can use this property to determine the source of events received by your snapshot listener: */
  }

  private collection() {
    return this.angularFirestore.collection<TRaw>(this.collectionName);
  }

  private itemDoc(itemId: OdmItemId) {
    return this.collection().doc(itemId)
  }

}
