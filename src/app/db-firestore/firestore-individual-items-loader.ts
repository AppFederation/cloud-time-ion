import * as firebase from 'firebase'

import { FirestoreItemsLoader } from './firestore-items-loader'
import DocumentReference = firebase.firestore.DocumentReference
import DocumentSnapshot = firebase.firestore.DocumentSnapshot

export class FirestoreIndividualItemsLoader extends FirestoreItemsLoader {
  /* refactor to return observable */
  getItem$ByRef(itemRef: DocumentReference, callback: (includedItemDoc: DocumentSnapshot) => void) {
    itemRef.onSnapshot(callback)
  }
}
