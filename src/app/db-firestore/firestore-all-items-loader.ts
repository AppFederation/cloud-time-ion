import * as firebase from 'firebase'

import { FirestoreItemsLoader } from './firestore-items-loader'
import DocumentReference = firebase.firestore.DocumentReference
import QuerySnapshot = firebase.firestore.QuerySnapshot
import DocumentChange = firebase.firestore.DocumentChange
import DocumentSnapshot = firebase.firestore.DocumentSnapshot
import {
  debugLog,
  FIXME,
} from '../utils/log'

export class ItemValueAndCallbacks {
  constructor(
    public documentSnapshot: DocumentSnapshot = null,
    public callbacks = []
  ) {}
}

export class FirestoreAllItemsLoader extends FirestoreItemsLoader {

  mapItemIdToDescriptor = new Map<string, ItemValueAndCallbacks>()
  // mapItemIdToCallbacks = new Map()

  constructor() {
    super()
  }

  startQuery(
    /* this will have to be filtered to only what the user has read permission for */
    itemsCollection: firebase.firestore.CollectionReference
  ) {
    itemsCollection.onSnapshot((snapshot: QuerySnapshot) => {
      snapshot.docChanges().forEach((change: DocumentChange) => {
        const documentSnapshot = change.doc
        debugLog('FirestoreAllItemsLoader onSnapshot id', change.doc.id, 'DocumentChange', change)
        if (change.type === 'added' || change.type === 'modified') {
          this.putItemAndFireCallbacks(documentSnapshot)
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
