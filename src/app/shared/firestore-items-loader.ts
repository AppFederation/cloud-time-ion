import * as firebase from 'firebase'

import DocumentReference = firebase.firestore.DocumentReference
import DocumentSnapshot = firebase.firestore.DocumentSnapshot

export abstract class FirestoreItemsLoader {

  abstract getItem$ByRef(itemRef: DocumentReference, callback: (includedItemDoc: DocumentSnapshot) => void)

}
