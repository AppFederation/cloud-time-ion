// import 'firebase/firestore';

// import firestore from 'firebase/firestore';
import { firestore } from 'firebase'
import DocumentReference = firestore.DocumentReference
import DocumentSnapshot = firestore.DocumentSnapshot


export abstract class FirestoreItemsLoader {

  abstract getItem$ByRef(itemRef: DocumentReference, callback: (includedItemDoc: DocumentSnapshot) => void)

}
