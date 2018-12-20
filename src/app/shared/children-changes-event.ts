import DocumentSnapshot = firebase.firestore.DocumentSnapshot

export class ChildrenChangesEvent {
  constructor(
    public inclusionsAdded: Map<string, DocumentSnapshot>
  ) {

  }
}
