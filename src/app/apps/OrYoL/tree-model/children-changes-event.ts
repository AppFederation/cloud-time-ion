
/* This could be made more Firebase-independent by unpacking what is in DocumentSnapshot into db-vendor-independent form*/
import {DocumentSnapshot} from '@angular/fire/compat/firestore'

export class ChildrenChangesEvent {
  constructor(
    public inclusionsAdded: Map<string, DocumentSnapshot<any>>,
    public inclusionsModified: Map<string, DocumentSnapshot<any>>,
  ) {

  }
}
