// import * as firebase from 'firebase'
import { firestore } from 'firebase'
import DocumentReference = firestore.DocumentReference
import DocumentSnapshot = firestore.DocumentSnapshot

import { FirestoreItemsLoader } from './firestore-items-loader'
import QuerySnapshot = firestore.QuerySnapshot
import DocumentChange = firestore.DocumentChange

import {
  debugLog,
  FIXME,
} from '../utils/log'
import { PermissionsManager } from '../tree-model/PermissionsManager'

export class ItemValueAndCallbacks {
  constructor(
    public documentSnapshot: DocumentSnapshot = null,
    public callbacks = []
  ) {}
}

export class FirestoreAllItemsLoader extends FirestoreItemsLoader {

  /* FIXME: use shared */
  permissionsManager = new PermissionsManager('FIXME')

  mapItemIdToDescriptor = new Map<string, ItemValueAndCallbacks>()
  // mapItemIdToCallbacks = new Map()

  constructor() {
    super()
  }

  startQuery(
    /* this will have to be filtered to only what the user has read permission for */
    itemsCollection: firebase.firestore.CollectionReference
  ) {
    itemsCollection
      // .where('perms.read.' + this.permissionsManager.userId, '>', new Date(0))
      .onSnapshot((snapshot: QuerySnapshot) =>
    {
      snapshot.docChanges().forEach((change: DocumentChange) => {
        const docSnapshot: firestore.QueryDocumentSnapshot = change.doc
        const docId = change.doc.id
        const docData = change.doc.data()
        const owner = docData.owner
        const karolOwner = `FIXME____`
        if ( ! owner ) {
          debugLog(`OrYoL item no owner `, docId)
          //this.itemDoc(id).update({owner: karolOwner})
        } else {
          debugLog(`OrYoL item yes owner `, docId, owner)
          if ( owner !== karolOwner ) {
            window.alert(`OrYoL some other owner!! ` + `docId:` + docId + ` owner: ` + owner)
          }
        }



        debugLog('FirestoreAllItemsLoader onSnapshot id', docId, 'DocumentChange', change)
        if (change.type === 'added' || change.type === 'modified') {
          this.putItemAndFireCallbacks(docSnapshot)
        }
        // if (change.type === 'modified') {
        //   debugLog('FirestoreAllItemsLoader modified: ', nodeInclusionData);
        //   // listener.onNodeInclusionModified(nodeInclusionId, nodeInclusionData)
        // }
        if (change.type === 'removed') {
          FIXME('FirestoreAllItemsLoader change.type === \'removed\'', change)
          // debugLog('Removed city: ', nodeInclusionData);
        }
      })

    })
  }


  /* refactor to return observable */
  getItem$ByRef(itemRef: DocumentReference, callback) {
    const id = itemRef.id
    let entry = this.mapItemIdToDescriptor.get(id)
    if ( ! entry ) {
      entry = new ItemValueAndCallbacks()
      this.mapItemIdToDescriptor.set(id, entry)
    }
    entry.callbacks.push(callback)
    if ( entry.documentSnapshot ) {
      // we already have a snapshot; have to notify the new callback; otherwise the new callback would miss the already existing value
      callback(entry.documentSnapshot)
    }
  }

  private putItemAndFireCallbacks(documentSnapshot: DocumentSnapshot) {
    debugLog('putItemAndFireCallbacks, id', documentSnapshot.id, 'size', this.mapItemIdToDescriptor.size)
    const id = documentSnapshot.id
    let entry = this.mapItemIdToDescriptor.get(id)
    if ( ! entry ) {
      entry = new ItemValueAndCallbacks(/*documentSnapshot*/)
      this.mapItemIdToDescriptor.set(id, entry)
    }
    entry.documentSnapshot = documentSnapshot
    for ( let callback of entry.callbacks ) {
      callback(documentSnapshot)
    }
  }
}
