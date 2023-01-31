import {DocumentReference, DocumentSnapshot} from '@angular/fire/compat/firestore'


export abstract class FirestoreItemsLoader {

  abstract getItem$ByRef(itemRef: DocumentReference, callback: (includedItemDoc: DocumentSnapshot<any>) => void): any

}
