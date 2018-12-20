import { Injectable } from '@angular/core';
import {
  DbTreeListener,
  NodeAddEvent,
  NodeInclusion,
} from './TreeListener'
import { OryTreeNode } from './TreeModel'
import {
  debugLog,
  } from './log'
import * as firebase from 'firebase'
import { DbTreeService } from './db-tree-service'
import { FirestoreAllItemsLoader } from './firestore-all-items-loader'
// import * as firebase from 'firebase/app'
import QuerySnapshot = firebase.firestore.QuerySnapshot
import DocumentReference = firebase.firestore.DocumentReference
import DocumentSnapshot = firebase.firestore.DocumentSnapshot
import { FIXME } from './log'
import { FirestoreAllInclusionsSyncer } from './FirestoreAllInclusionsSyncer'
import { ChildrenChangesEvent } from './children-changes-event'

const firebase1 = require('firebase');
// Required for side-effects
require('firebase/firestore');


firebase1.initializeApp({
  apiKey: 'AIzaSyAVVLpc9MvJw7dickStZcAd3G5ZI5fqE6I',
  authDomain: 'oryol-app.firebaseapp.com',
  databaseURL: 'https://oryol-app.firebaseio.com',
  projectId: 'oryol-app',
  storageBucket: 'oryol-app.appspot.com',
  messagingSenderId: '970393221829'
});


// Initialize Cloud Firestore through Firebase
const firestore = firebase1.firestore();
const db = firestore;
firestore.settings({
  timestampsInSnapshots: true,
})

export interface FirestoreNodeInclusion {
  childNode: DocumentReference,
  orderNum: number,
  nodeInclusionId: string
  /** only in AllItemsSyncer; should really be called parentItem ? */
  parentNode?: DocumentReference,
}


@Injectable()
export class FirestoreTreeService extends DbTreeService {

  static dbPrefix = 'DbWithAllInclusionsSyncer'

  pendingListeners = 0

  private ITEMS_COLLECTION = FirestoreTreeService.dbPrefix + '_items'
  private ROOTS_COLLECTION = FirestoreTreeService.dbPrefix + '_roots'
  // private dbItemsLoader: FirestoreItemsLoader = new FirestoreIndividualItemsLoader()
  dbItemsLoader = new FirestoreAllItemsLoader()
  dbInclusionsSyncer = new FirestoreAllInclusionsSyncer(db, FirestoreTreeService.dbPrefix)

  constructor() {
    super()
    db.enablePersistence().then(() => {
      // window.alert('persistence enabled')
      this.dbItemsLoader.startQuery(this.itemsCollection())
      this.dbInclusionsSyncer.startQuery()
    })
    // this.listenToChanges(onSnapshotHandler)
  }

  deleteWithoutConfirmation(itemId: string) {
    this.itemDocById(itemId).update('deleted', new Date())
    console.log('deleted ' + itemId)
  }

  loadNodesTree(listener: DbTreeListener) {
    debugLog('loadNodesTree')
    db.collection(this.ROOTS_COLLECTION).onSnapshot(snapshot => {
      // console.log('loadNodesTree onSnapshot()', snapshot)
    })
    // this.processNodeEvents(0, snapshot, [], listener)
    this.handleSubNodes(this.itemDocById(this.HARDCODED_ROOT_NODE_ITEM_ID), [], 0, listener)
  }

  private processNodeEvents(nestLevel: number, childrenChangesEvent: ChildrenChangesEvent, parents: DocumentReference[], listener: DbTreeListener) {
    const serviceThis = this
    childrenChangesEvent.inclusionsAdded.forEach(inclusionAdded => {
      // debugLog('docChanges change.type', change.type);

      // debugLog('nodeInclusionData ... change.doc', change.doc)
      const nodeInclusionData = inclusionAdded.data() as FirestoreNodeInclusion
      const nodeInclusionId = nodeInclusionData.nodeInclusionId
      // if (change.type === 'added') {
        const parentsPath = serviceThis.nodesPath(parents)
        // FIXME: why is this called when parent node is EDITED ???
        debugLog('added-node-inclusion event: ', nestLevel, parentsPath, nodeInclusionData);
        debugLog('listener.onNodeAddedOrModified change includedItemDoc.id ' + nodeInclusionData.childNode.id, childrenChangesEvent)
        serviceThis.pendingListeners ++
        // ==== per-item callback:
        serviceThis.dbItemsLoader.getItem$ByRef(nodeInclusionData.childNode, (includedItemDoc: DocumentSnapshot) => {
          serviceThis.pendingListeners --
          // const nodeInclusionId = change.doc.id FIXME()
          // console.log('nodeInclusionId', nodeInclusionId)
          const nodeInclusion = new NodeInclusion(nodeInclusionData.orderNum, nodeInclusionId)
          // console.log('includedItemDoc', includedItemDoc)
          const itemData = includedItemDoc.exists ? includedItemDoc.data() : null
          // console.log('itemData:::', itemData)
          debugLog('listener.onNodeAddedOrModified change includedItemDoc.id ' + includedItemDoc.id, childrenChangesEvent)
          listener.onNodeAddedOrModified(
            new NodeAddEvent(parentsPath, parentsPath[parentsPath.length - 1], itemData, includedItemDoc.id,
              serviceThis.pendingListeners, nodeInclusion))
          // debugLog('target node:', nestLevel, includedItemDoc)
          // debugLog('target node title:', nestLevel, targetNodeDoc.data().title)
        })
        // ==== end per-item callback
        serviceThis.handleSubNodes(nodeInclusionData.childNode, parents, nestLevel, listener) // why is this inside per-item callback?

        // debugLog('root node ref: ', targetNode);
      // }
      // if (change.type === 'modified') {
      //   debugLog('Modified city: ', nodeInclusionData);
      //   listener.onNodeInclusionModified(nodeInclusionId, nodeInclusionData)
      // }
      // if (change.type === 'removed') {
      //   debugLog('Removed city: ', nodeInclusionData);
      // }
    })
  }

  private handleSubNodes(targetNodeDocRef: DocumentReference, parents: DocumentReference[], nestLevel: number, listener: DbTreeListener) {
    // TODO: do not use subCollection for FirestoreAllInclusionsSyncer - all inclusions are in a single collection
    this.dbInclusionsSyncer.getChildInclusionsForParentItem$(targetNodeDocRef.id).subscribe(event => {
      const newParents: DocumentReference[] = parents.slice(0)
      newParents.push(targetNodeDocRef)
      this.processNodeEvents(nestLevel + 1, event, newParents, listener)
    })
    // const subCollection = targetNodeDocRef.collection('subNodes' /* note: those are really inclusions of sub nodes */)
    // debugLog('subColl:', subCollection)
    // subCollection.onSnapshot((subSnap: QuerySnapshot) => {
    //   const newParents: DocumentReference[] = parents.slice(0)
    //   newParents.push(targetNodeDocRef)
    //   this.processNodeEvents(nestLevel + 1, subSnap, newParents, listener)
    // })
  }

  nodesPath(path: DocumentReference[]) {
    return path.map(ref => {
      // let segments = ref.id.path.segments
      return ref.id // hack: probably replace with change.doc.id
    })
  }

  private itemsCollection(): firebase.firestore.CollectionReference {
    return db.collection(this.ITEMS_COLLECTION)
  }

  moveNode(dbId: string, dbId2: string) {
    this.itemDocById(dbId2).collection('subNodes').add({
      node: this.itemDocById(dbId)
    })
    // db.collection(this.node)
  }

  private itemDocById(dbId: string): DocumentReference {
    return this.itemsCollection().doc(dbId)
  }

  private addNodeInclusionToParent(parentId: string, nodeInclusion: NodeInclusion /*{ node: firebase.firestore.DocumentReference }*/,
                                   childNode: OryTreeNode, childItemDocRef: DocumentReference
  ) {
    const nodeInclusionFirebaseObject: FirestoreNodeInclusion = {
      // childNode: this.itemDocById(childNode.dbId),
      childNode: childItemDocRef,
      orderNum: nodeInclusion.orderNum,
      nodeInclusionId: nodeInclusion.nodeInclusionId
    }
    // this.subNodesCollectionForItem(parentId).add(nodeInclusionFirebaseObject)
    // this.dbInclusionsSyncer.addNodeInclusionToParent(nodeInclusion.nodeInclusionId, parentId, nodeInclusionFirebaseObject)
    this.dbInclusionsSyncer.addNodeInclusionToParent(nodeInclusion, parentId, this.itemDocById(parentId), nodeInclusionFirebaseObject)
  }

// TODO:
// to as little as possible in vendor specific class (FirestoreTreeService)
// pre-calculate next/previous order in TreeModel
  addNodeToDb(parent, nodeBefore, odeAfter, orderBefore, orderAfter) {

  }

  /* TODO: should be called *create*, because it is a completely new node/item involving db, vs addChild just looks like tree-only operation */
  addSiblingAfterNode(parentNode: OryTreeNode, newNode: OryTreeNode, afterExistingNode: OryTreeNode, previousOrderNumber, newOrderNumber, nextOrderNumber) {
    debugLog('addSiblingAfterNode', newNode, afterExistingNode)
    // let parentId = afterExistingNode.parent2.dbId // will not work yet; "imaginary root"
    // let parentId = this.HARDCODED_ROOT_NODE // HACK to simplify for now
    let parentId = parentNode.itemId // HACK to simplify for now
    // console.log('addSiblingAfterNode nodeBelow', nodeBelow)
    // add node itself to firestore (BEFORE inclusion)
    const newItem = {
      // title: 'added node title ' + new Date()
      title: OryTreeNode.INITIAL_TITLE
    }

    this.itemsCollection().doc(newNode.itemId).set(newItem).then(() => {
      const itemDocRef = this.itemDocById(newNode.itemId)
      // console.log('itemDocRef', itemDocRef)
      // newNode.itemId = itemDocRef.id // NOTE: initially it is UUID, overwritten here /* Perhaps this indirectly causes ExpressionChangedAfterItHasBeenCheckedError */
      this.addNodeInclusionToParent(parentId, newNode.nodeInclusion, newNode, itemDocRef)
    })
    // add node-inclusion to firestore
    // ignore parent for now? But then how do we specify node-inclusion / order?
    // -> make a hardcoded root for my flexagenda tasks

    // For FlexAgenda-Oryol prototype: only use a hardcoded node as a root of the *tree*model*.
    // on firestore, ignore completely the concept of roots, or adding or listing them

    // design question: order is only specified in node-inclusion?
    // meaning: if a node is not included in a parent, it has no ordering? Probably.

    // ======
    // !!!! Idea/Epiphany: for retrieving ALL of user's nodes in one query (for a a MASSIVE speedup), I could try to use Firestore's query,
    // which CAN supposedly work across even nodes for which we do not have permissions to read, as long as they are
    // not included in the results (vs "rules are NOT filters" in Firebase realtime DB).
    // for the query criterion, I could use a special attribute, e.g. User_read_permitted_<USER_ID>=true
    // FIXME()
    // throw new Error('TESTING')

    // TODO: return nodeInclusion? (could be useful if it was not provided as an argument)
  }

  patchItemData(itemId: string, itemData: any) {
    return this.itemDocById(itemId).update(itemData)
  }

  patchChildInclusionData(parentItemId: string, itemInclusionId: string, itemInclusionData: any) {
    debugLog('patchChildInclusionData', arguments)
    this.dbInclusionsSyncer.patchChildInclusionData(parentItemId, itemInclusionId, itemInclusionData)
    // return this.subNodesCollectionForItem(parentItemId).doc(itemInclusionId).update(itemInclusionData)
  }

}
