import DocumentReference = firebase.firestore.DocumentReference

export abstract class FirestoreItemsLoader {

  abstract getItem$ByRef(itemRef: DocumentReference, callback)

}
