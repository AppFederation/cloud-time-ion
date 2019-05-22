// import * as firebase from 'firebase'
import { firestore } from 'firebase'
// import DocumentReference = firestore.DocumentReference
import DocumentSnapshot = firestore.DocumentSnapshot

/* This could be made more Firebase-independent by unpacking what is in DocumentSnapshot into db-vendor-independent form*/
export class ChildrenChangesEvent {
  constructor(
    public inclusionsAdded: Map<string, DocumentSnapshot>,
    public inclusionsModified: Map<string, DocumentSnapshot>,
  ) {

  }
}
