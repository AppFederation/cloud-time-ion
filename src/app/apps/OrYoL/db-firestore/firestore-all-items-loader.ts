
import { FirestoreItemsLoader } from './firestore-items-loader'

import {
  debugLog,
  FIXME,
} from '../utils/log'
import { PermissionsManager } from '../tree-model/PermissionsManager'
import {
  CollectionReference,
  DocumentChange,
  DocumentReference,
  DocumentSnapshot,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from '@angular/fire/compat/firestore'

export class ItemValueAndCallbacks {
  constructor(
    public documentSnapshot: DocumentSnapshot<any> | null = null,
    public callbacks: any[] = []
  ) {}
}

export class FirestoreAllItemsLoader extends FirestoreItemsLoader {

  /* FIXME: use shared */
  permissionsManager = new PermissionsManager('FIXME')

  mapItemIdToDescriptor = new Map<string, ItemValueAndCallbacks>()
  // mapItemIdToCallbacks = new Map()

  constructor() {
    super()
  }

  startQuery(
    /* this will have to be filtered to only what the user has read permission for */
    itemsCollection: Query
  ) {
    itemsCollection
      // .where('perms.read.' + this.permissionsManager.userId, '>', new Date(0))
      .onSnapshot((snapshot: QuerySnapshot<any>) =>
    {
      console.log(`FirestoreAllItemsLoader snapshot.docChanges().length`, snapshot.docChanges().length)
      snapshot.docChanges().forEach((change: DocumentChange<any>) => {
        const docSnapshot: QueryDocumentSnapshot<any> = change.doc
        const docId = change.doc.id
        const docData = change.doc.data()
        const owner = docData.owner
        const karolOwner = `FIXME____`
        if ( ! owner ) {
          debugLog(`OrYoL item no owner `, docId)
          //this.itemDoc(id).update({owner: karolOwner})
        } else {
          debugLog(`OrYoL item yes owner `, docId, owner)
          if ( owner !== karolOwner ) {
            window.alert(`OrYoL some other owner!! ` + `docId:` + docId + ` owner: ` + owner)
          }
        }

        debugLog('FirestoreAllItemsLoader onSnapshot id', docId, 'DocumentChange', change)
        if (change.type === 'added' || change.type === 'modified') {
          this.putItemAndFireCallbacks(docSnapshot)
        }
        // if (change.type === 'modified') {
        //   debugLog('FirestoreAllItemsLoader modified: ', nodeInclusionData);
        //   // listener.onNodeInclusionModified(nodeInclusionId, nodeInclusionData)
        // }
        if (change.type === 'removed') {
          FIXME('FirestoreAllItemsLoader change.type === \'removed\'', change)
          // debugLog('Removed city: ', nodeInclusionData);
        }
      })

    })
  }


  /* refactor to return observable */
  getItem$ByRef(itemRef: DocumentReference, callback: any) {
    const id = itemRef.id
    let entry = this.mapItemIdToDescriptor.get(id)
    if ( ! entry ) {
      entry = new ItemValueAndCallbacks()
      this.mapItemIdToDescriptor.set(id, entry)
    }
    entry.callbacks.push(callback)
    if ( entry.documentSnapshot ) {
      // we already have a snapshot; have to notify the new callback; otherwise the new callback would miss the already existing value
      callback(entry.documentSnapshot)
    }
  }

  private putItemAndFireCallbacks(documentSnapshot: DocumentSnapshot<any>) {
    debugLog('putItemAndFireCallbacks, id', documentSnapshot.id, 'size', this.mapItemIdToDescriptor.size)
    const id = documentSnapshot.id
    let entry = this.mapItemIdToDescriptor.get(id)
    if ( ! entry ) {
      entry = new ItemValueAndCallbacks(/*documentSnapshot*/)
      this.mapItemIdToDescriptor.set(id, entry)
    }
    entry.documentSnapshot = documentSnapshot
    for ( let callback of entry.callbacks ) {
      callback(documentSnapshot)
    }
  }
}
