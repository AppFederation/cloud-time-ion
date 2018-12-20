import * as firebase from 'firebase'
import DocumentChange = firebase.firestore.DocumentChange
import {
  debugLog,
  FIXME,
} from './log'
import QuerySnapshot = firebase.firestore.QuerySnapshot
import { NodeInclusion } from './TreeListener'
import {
  FirestoreNodeInclusion,
  FirestoreTreeService,
} from './firestore-tree.service'
import DocumentReference = firebase.firestore.DocumentReference

export class FirestoreAllInclusionsSyncer {

  private INCLUSIONS_COLLECTION = this.dbPrefix + '_inclusions'

  constructor(
    private db: firebase.firestore.Firestore,
    private dbPrefix: string,
  ) {

  }

  private inclusionsCollection(): firebase.firestore.CollectionReference {
    return this.db.collection(this.INCLUSIONS_COLLECTION)
  }

  startQuery(inclusionsCollection: firebase.firestore.CollectionReference) {
    // inclusionsCollection.onSnapshot((snapshot: QuerySnapshot) => {
    //   snapshot.docChanges().forEach((change: DocumentChange) => {
    //     const documentSnapshot = change.doc
    //     debugLog('FirestoreAllInclusionsSyncer onSnapshot id', change.doc.id, 'DocumentChange', change)
    //     if (change.type === 'added' || change.type === 'modified') {
    //       this.putItemAndFireCallbacks(documentSnapshot)
    //     }
    //     // if (change.type === 'modified') {
    //     //   debugLog('FirestoreAllItemsLoader modified: ', nodeInclusionData);
    //     //   // listener.onNodeInclusionModified(nodeInclusionId, nodeInclusionData)
    //     // }
    //     if (change.type === 'removed') {
    //       FIXME('FirestoreAllItemsLoader change.type === \'removed\'', change)
    //       // debugLog('Removed city: ', nodeInclusionData);
    //     }
    //   })
    //
    // })

  }

  getChildInclusionsForParentItem$(parentItemId: string) {
    FIXME('getChildInclusionsForParentItem$')
  }

  addNodeInclusionToParent(
      nodeInclusion: NodeInclusion,
      parentId: string,
      parentDoc: DocumentReference,
      nodeInclusionFirebaseObject: FirestoreNodeInclusion
  ) {
    nodeInclusionFirebaseObject.parentNode = parentDoc
    this.inclusionsCollection().doc(nodeInclusion.nodeInclusionId).set(nodeInclusionFirebaseObject)
  }
}
