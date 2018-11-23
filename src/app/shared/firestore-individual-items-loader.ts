import { FirestoreItemsLoader } from './firestore-items-loader'
import DocumentReference = firebase.firestore.DocumentReference

export class FirestoreIndividualItemsLoader extends FirestoreItemsLoader {
  /* refactor to return observable */
  getItem$ByRef(itemRef: DocumentReference, callback) {
    itemRef.onSnapshot(callback)
  }
}
