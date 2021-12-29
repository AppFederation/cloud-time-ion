import {ItemId, OdmCollectionBackend, OdmCollectionBackendListener} from "../../AppFedShared/odm/OdmCollectionBackend";
import {Injector} from "@angular/core";
import {AngularFirestore, DocumentChange, QuerySnapshot} from "@angular/fire/firestore";
import {OdmItemId} from "../../AppFedShared/odm/OdmItemId";
import {ignorePromise} from "../../AppFedShared/utils/promiseUtils";
import {OdmBackend} from "../../AppFedShared/odm/OdmBackend";
import {debugLog, errorAlert, errorAlertAndThrow} from "../../AppFedShared/utils/log";
import {isNotNullish} from '../../AppFedShared/utils/utils'
import {assertTruthy} from '../../AppFedShared/utils/assertUtils'


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
  }

  deleteWithoutConfirmation(itemId: OdmItemId) {
    // DANGEROUS return  this. /* danger */ itemDoc(itemId) /* danger */  .delete()
    return this.itemDoc(itemId).update({
      whenDeleted: new Date()
    })
  }

  saveNowToDb(item: TRaw, id: string, parentIds?: ItemId[], ancestorIds?: ItemId[]): Promise<any> {
    if ( ! isNotNullish(id) ) {
      errorAlert('id cannot be ' + id)
    }
    // TODO: also store ancestorIds for loading entire subtree in 1 query (e.g. for faster searching)
    // debugLog('FirestoreOdmCollectionBackend saveNowToDb', item)
    try {
      const retPromise = this.itemDoc(id).set({
        ... item,
        ... (parentIds ? {
          parentIds
        } : {}),
        ... (ancestorIds ? {
          ancestorIds
        } : {}),
      }/*.toDbFormat()*/)
      return retPromise
    } catch (error: any) {
      throw errorAlertAndThrow(`saveNowToDb error: `, error, item, id)
    }
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

  setListener(listener: OdmCollectionBackendListener<TRaw, OdmItemId<TRaw>>) {
    super.setListener(listener);
    // debugLog(`BEFORE this.collectionBackendReady$.subscribe(() => {`, this.collectionName)
    this.collectionBackendReady$.subscribe(() => {
      // debugLog(`IN this.collectionBackendReady$.subscribe(() => {`, this.collectionName)

      // This could cause the race condition of items uninitialized when going from another route
      const userId = this.authService.authUser$.lastVal!.uid
      if ( ! userId ) {
        errorAlert(`FirestoreOdmCollectionBackend before query - no userId`)
      }
      this.angularFirestore.firestore.collection(this.collectionName)
        .where('owner', '==', userId)
        .onSnapshot(((snapshot: QuerySnapshot<TRaw>) =>
        {
          // console.log('firestore.collection(this.collectionName).onSnapshot', 'snapshot.docChanges().length', snapshot.docChanges().length)
          // FIXME: let the service process in batch, for performance --> is this done now, thanks to onFinishedProcessing() ?
          for ( let change of snapshot.docChanges() ) {
            const docId = change.doc.id
            const docData = change.doc.data()
            // this.setOwnerIfNeeded(docData, docId)
            if ( change.type === 'added' ) {
              listener?.onAdded(docId, docData as TRaw)
            } else if ( change.type === 'modified') {
              listener?.onModified(docId, docData as TRaw)
            } else if ( change.type === 'removed') {
              listener?.onRemoved(docId)
            }
          }
          listener?.onFinishedProcessingChangeSet()

          // FIXME: only emit after processing finished

        }) as any /* workaround after strict settings */)
      // this.collection().valueChanges().subscribe((coll: TRaw[]) => {
      //   this.dbCollection$.nextWithCache(coll)
      // })
    })
  }

  loadChildrenOf(parentId: ItemId, listener: OdmCollectionBackendListener<TRaw>) {
    assertTruthy(parentId, 'parentId')
    const userId = this.authService.authUser$.lastVal?.uid
    console.info('loadChildrenOf', arguments)
    let query = this.angularFirestore.firestore.collection(this.collectionName)
      .where('parentIds', 'array-contains', parentId)
    if ( userId ) {
      query = query.where('owner', '==', userId)
    }
    query.onSnapshot(((snapshot: QuerySnapshot<TRaw>) =>
      {
        console.log(`loadChildrenOf ${parentId} firestore.collection(this.collectionName).onSnapshot`, 'snapshot.docChanges().length', snapshot.docChanges().length)
        // FIXME: let the service process in batch, for performance --> is this done now, thanks to onFinishedProcessing() ?
        for ( let change of snapshot.docChanges() ) {
          const docId = change.doc.id
          const docData = change.doc.data()
          // this.setOwnerIfNeeded(docData, docId)
          if ( change.type === 'added' ) {
            listener?.onAdded(docId, docData as TRaw)
          } else if ( change.type === 'modified') {
            listener?.onModified(docId, docData as TRaw)
          } else if ( change.type === 'removed') {
            listener?.onRemoved(docId)
          }
        }
        listener?.onFinishedProcessingChangeSet()

        // FIXME: only emit after processing finished

      }) as any /* workaround after strict settings */)

  }

}
