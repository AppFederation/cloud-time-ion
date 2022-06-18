// import * as firebase from 'firebase'
import { firestore } from 'firebase'
import DocumentReference = firestore.DocumentReference
import DocumentSnapshot = firestore.DocumentSnapshot

import { FirestoreItemsLoader } from './firestore-items-loader'

export class FirestoreIndividualItemsLoader extends FirestoreItemsLoader {
  /* refactor to return observable */
  getItem$ByRef(itemRef: DocumentReference, callback: (includedItemDoc: DocumentSnapshot) => void) {
    itemRef.onSnapshot(callback)
  }
}
