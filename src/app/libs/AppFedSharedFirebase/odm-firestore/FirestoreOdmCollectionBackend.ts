import {ItemId, OdmCollectionBackend, OdmCollectionBackendListener} from "../../AppFedShared/odm/OdmCollectionBackend";
import {Injector} from "@angular/core";
import {AngularFirestore, AngularFirestoreDocument, DocumentChange, QuerySnapshot} from "@angular/fire/compat/firestore";
import {OdmItemId} from "../../AppFedShared/odm/OdmItemId";
import {ignorePromise} from "../../AppFedShared/utils/promiseUtils";
import {OdmBackend} from "../../AppFedShared/odm/OdmBackend";
import {debugLog, errorAlert, errorAlertAndThrow} from "../../AppFedShared/utils/log";
import {isNotNullish} from '../../AppFedShared/utils/utils'
import {assertTruthy} from '../../AppFedShared/utils/assertUtils'
import {dateToStringSuitableForId, getNowTimePointSuitableForId} from '../../AppFedShared/odm/utils'
// import { firestore } from 'firebase';
// import Timestamp = firestore.Timestamp


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

  /** Could also add archive here; and mark as deleted / trash */
  deleteWithoutConfirmation(itemId: OdmItemId) {
    // DANGEROUS return  this. /* danger */ itemDoc(itemId) /* danger */  .delete()
    // const angularFirestoreDocument = this.itemDoc(itemId) // as AngularFirestoreDocument<TRaw & { whenDeleted: Date}>
    const angularFirestoreDocument = this.itemDoc(itemId) as AngularFirestoreDocument<any> /* HACK after AngularFire update */
    return angularFirestoreDocument.update({
      whenDeleted: new Date()
    })
  }

  saveNowToDb(item: TRaw, id: string, parentIds?: ItemId[], ancestorIds?: ItemId[]): Promise<any> {
    if ( ! isNotNullish(id) ) {
      errorAlert('id cannot be ' + id)
    }

    this.saveToHistory(id, item, parentIds, ancestorIds) // NOTE: save to history FIRST, to prevent destroying the value
    // no need to await promise; this can go in parallel
    // FIXME though need to pass this promise to unsaved sync status pending

    // FIXME: maybe we should save PREVIOUS value, but more  difficult to implement for now. Coz current value will be on the object itself,
    // so no need to waste space duplicating. Though maybe it's good for


    // TODO: also store ancestorIds for loading entire subtree in 1 query (e.g. for faster searching)
    // debugLog('FirestoreOdmCollectionBackend saveNowToDb', item)

    // FIXME: review this coz modified with sleep deprivation, while introducing saveToHistory()
    try {
      const dataToSave = {
        ... item,
        ... (parentIds ? {
          parentIds
        } : {}),
        ... (ancestorIds ? {
          ancestorIds
        } : {}),
      }
      const retPromise = this.itemDoc(id).set(dataToSave/*.toDbFormat()*/)
      /* TODO: could store minLevelFromRoot number, for <= .where clause to limit number of levels */
      return retPromise
    } catch (error: any) {
      throw errorAlertAndThrow(`saveNowToDb error: `, error, item, id)
    }
    // FIXME: update() to patch

    // https://firebase.google.com/docs/firestore/query-data/listen#events-local-changes
    /* Retrieved documents have a metadata.hasPendingWrites property that indicates whether the document has local changes that haven't been written to the backend yet.
      You can use this property to determine the source of events received by your snapshot listener: */
  }

  private saveToHistory(id: string, item: TRaw, parentIds: ItemId[] | undefined, ancestorIds: ItemId[] | undefined): Promise<void> {
    try {
      const nowDate = new Date
      const dataToSave = {
        /* FIXME refactor extract common part with saveNowToDb */
        ...item,
        ...(parentIds ? {
          parentIds,
        } : {}),
        ...(ancestorIds ? {
          ancestorIds,
        } : {}),
        itemId: id /* not calling it `id` coz the primary key is different */,
        _historySnapshotTimestamp: nowDate /* FIXME find good name; `when` was too vague */,

      }
      const retPromise = this.itemHistoryNewDocForNowTimePoint(nowDate, id).set(dataToSave/*.toDbFormat()*/)
      /* TODO: could store minLevelFromRoot number, for <= .where clause to limit number of levels */
      return retPromise // FIXME need to pass this promise to unsaved for pending status too
    } catch (error: any) {
      throw errorAlertAndThrow(`saveNowToDb saving history error: `, error, item, id)
    }
  }

  /* FIXME cache this; maybe it causes excessive loads? Anyway it's good to cache externally obtained stuff coz we don't know their impl. */
  private collection() {
    return this.angularFirestore.collection<TRaw>(this.collectionName);
  }

  private historyCollection() {
    return this.angularFirestore.collection<TRaw>(this.collectionName + '__History' /* double underscore coz it's very meta :) */);
  }

  private itemDoc(itemId: OdmItemId) {
    return this.collection().doc(itemId)
  }

  private itemHistoryNewDocForNowTimePoint(date: Date, itemId: OdmItemId) {
    const path = itemId + '_' /* just one _ to avoid triple _ coz of the stupid _ trailing */ + dateToStringSuitableForId(date)
    return this.historyCollection().doc(path)
  }

  /** IDEA: for more flexibility this could return an ARRAY of download DESCRIPTORS
   * { promise:, name: 'LearnItem - last 10 days - from local/server'}
   * */
  override setListener(
    listener: OdmCollectionBackendListener<TRaw, OdmItemId<TRaw>>,
    /** FIXME move this to opts, also for readability coz integer is hard to judge what it does */
    nDaysOldModified: number,
    callback: () => void/*, name: string*/
  )
    : void
  {
    super.setListener(listener, nDaysOldModified, callback);
    // debugLog(`BEFORE this.collectionBackendReady$.subscribe(() => {`, this.collectionName)
    this.collectionBackendReady$.subscribe(() => {
      // debugLog(`IN this.collectionBackendReady$.subscribe(() => {`, this.collectionName)

      // This could cause the race condition of items uninitialized when going from another route
      const userId = this.authService.authUser$.lastVal!.uid
      if ( ! userId ) {
        errorAlert(`FirestoreOdmCollectionBackend before query - no userId`)
      }
      // console.log('FirestoreOdmCollectionBackend setListener')
      // nDaysOldModified = 15
      // getDocs
      // .where('whenArchived', '==', null)
      // .where('whenDeleted', '==', null)
      const query = this.angularFirestore.firestore.collection(this.collectionName)
        .where('owner', '==', userId)
      if ( nDaysOldModified ) {
        const promise = query
          .orderBy("whenLastModified", 'desc')
          // .where('whenLastModified', '>=', new Timestamp(Date.now()/1000 - nDaysOldModified * 24*60*60, 0))
          .limit(50) // FIXME hack limit count instead of date (coz what if user doesn't use app for some days)
          .get({source: 'cache'})
        promise.then((data: any /* HACK after AngularFire update */) => {
            for ( let doc of data.docs ) {
              listener?.onAdded(doc.id, doc.data() as TRaw)
            }
            listener?.onFinishedProcessingChangeSet()
            callback()
          }
        )
        // return promise
      } else {
        query.onSnapshot(((snapshot: QuerySnapshot<TRaw>) =>
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
          callback?.()

          // FIXME: only emit after processing finished

        }) as any /* workaround after strict settings */)
        return undefined
      }

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
      .where('parentIds', 'array-contains', parentId) // child parent here
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

  loadTreeDescendantsOf(ancestorId: ItemId, listener: OdmCollectionBackendListener<TRaw>) {
    assertTruthy(ancestorId, 'ancestorId')
    const userId = this.authService.authUser$.lastVal?.uid
    console.info('loadTreeDescendantsOf', arguments)
    let query = this.angularFirestore.firestore.collection(this.collectionName)
      .where('ancestorIds', 'array-contains', ancestorId)
    if ( userId ) {
      query = query.where('owner', '==', userId)
    }
    query.onSnapshot(((snapshot: QuerySnapshot<TRaw>) =>
    {
      console.log(`loadTreeDescendantsOf results ${ancestorId} firestore.collection(this.collectionName).onSnapshot`, 'snapshot.docChanges().length',
        snapshot.docChanges().length)
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
