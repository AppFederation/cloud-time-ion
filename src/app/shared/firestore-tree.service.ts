import { Injectable } from '@angular/core';
// import * as firebase from 'firebase/app'
import QuerySnapshot = firebase.firestore.QuerySnapshot
import {DbTreeListener, NodeAddEvent, NodeInclusion} from './TreeListener'
import {OryTreeNode} from './TreeModel'
import {defined, FIXME, nullOrUndef} from './utils'
import * as firebase from 'firebase'
import DocumentReference = firebase.firestore.DocumentReference
import {after} from 'selenium-webdriver/testing'
import {DbTreeService} from './db-tree-service'
import DocumentSnapshot = firebase.firestore.DocumentSnapshot

const firebase1 = require('firebase');
// Required for side-effects
require('firebase/firestore');

const uuidv4 = require('uuid/v4');

firebase1.initializeApp({
  apiKey: 'AIzaSyAVVLpc9MvJw7dickStZcAd3G5ZI5fqE6I',
  authDomain: 'oryol-app.firebaseapp.com',
  databaseURL: 'https://oryol-app.firebaseio.com',
  projectId: 'oryol-app',
  storageBucket: 'oryol-app.appspot.com',
  messagingSenderId: '970393221829'
});

const enableLogging = true

export function debugLog(...args) {
  if ( enableLogging ) {
    console.log('debugLog', ...args)
  }
}

// function onSnapshotHandler(snapshot) {
//   snapshot.docChanges.forEach(function(change) {
//     if (change.type === 'added') {
//       debugLog('New city: ', change.doc.data());
//     }
//     if (change.type === 'modified') {
//       debugLog('Modified city: ', change.doc.data());
//     }
//     if (change.type === 'removed') {
//       debugLog('Removed city: ', change.doc.data());
//     }
//   });
// }


// Initialize Cloud Firestore through Firebase
const db = firebase1.firestore();


export interface FirestoreNodeInclusion {
  childNode    : DocumentReference,
  orderNum: number,
  nodeInclusionId: string
}


@Injectable()
export class FirestoreTreeService extends DbTreeService {

  static dbPrefix = 'dbEmptyZZZ__16'

  pendingListeners = 0

  private ITEMS_COLLECTION = FirestoreTreeService.dbPrefix + 'items'
  private ROOTS_COLLECTION = FirestoreTreeService.dbPrefix + 'roots'

  constructor() {
    super()
    db.enablePersistence().then(() => {
      // window.alert('persistence enabled')
    })
    // this.listenToChanges(onSnapshotHandler)
  }

  // addItem() {
  //   db.collection('test1').add({
  //     testField: 'test ' + new Date(),
  //     testField2: new Date(),
  //     testField3: 10,
  //   })
  // }

  // listenToChanges(func) {
  //   db.collection('test1')
  //     .onSnapshot(func);
  // }

  // delete(id) {
  //   db.collection('test1').doc(id).delete()
  // }

  delete(itemId: string) {
    this.itemDocById(itemId).update('deleted', new Date())
    console.log('deleted ' + itemId)
  }

  loadNodesTree(listener: DbTreeListener) {
    console.log('loadNodesTree')
    db.collection(this.ROOTS_COLLECTION).onSnapshot(snapshot => {
      // console.log('loadNodesTree onSnapshot()', snapshot)
    })
    // this.processNodeEvents(0, snapshot, [], listener)
    this.handleSubNodes(this.itemDocById(this.HARDCODED_ROOT_NODE_ITEM_ID), [], 0, listener)
  }

  private processNodeEvents(nestLevel: number, snapshot: QuerySnapshot, parents: DocumentReference[], listener: DbTreeListener) {
    const serviceThis = this
    snapshot.docChanges.forEach(function(change) {
      debugLog('docChanges change.type', change.type);

      debugLog('nodeInclusionData ... change.doc', change.doc)
      const nodeInclusionData = change.doc.data() as FirestoreNodeInclusion
      const nodeInclusionId = nodeInclusionData.nodeInclusionId
      if (change.type === 'added') {
        const parentsPath = serviceThis.nodesPath(parents)
        // debugLog('added node inclusion event: ', nestLevel, parentsPath, nodeInclusionData);
        serviceThis.pendingListeners ++
        nodeInclusionData.childNode.onSnapshot((includedItemDoc: DocumentSnapshot) => {
          serviceThis.pendingListeners --
          // const nodeInclusionId = change.doc.id FIXME()
          // console.log('nodeInclusionId', nodeInclusionId)
          const nodeInclusion = new NodeInclusion(nodeInclusionData.orderNum, nodeInclusionId)
          // console.log('includedItemDoc', includedItemDoc)
          const itemData = includedItemDoc.exists ? includedItemDoc.data() : null
          // console.log('itemData:::', itemData)
          listener.onNodeAdded(
            new NodeAddEvent(parentsPath, parentsPath[parentsPath.length - 1], itemData, includedItemDoc.id,
              serviceThis.pendingListeners, nodeInclusion))
          // debugLog('target node:', nestLevel, includedItemDoc)
          // debugLog('target node title:', nestLevel, targetNodeDoc.data().title)
          serviceThis.handleSubNodes(includedItemDoc.ref, parents, nestLevel, listener)
        })
        // debugLog('root node ref: ', targetNode);
      }
      if (change.type === 'modified') {
        debugLog('Modified city: ', nodeInclusionData);
        listener.onNodeInclusionModified(nodeInclusionId, nodeInclusionData)
        FIXME()
      }
      if (change.type === 'removed') {
        debugLog('Removed city: ', nodeInclusionData);
      }
    })
  }

  private handleSubNodes(targetNodeDocRef: DocumentReference, parents: DocumentReference[], nestLevel: number, listener: DbTreeListener) {
    const subCollection = targetNodeDocRef.collection('subNodes')
    // debugLog('subColl:', subCollection)
    subCollection.onSnapshot((subSnap: QuerySnapshot) => {
      const newParents: DocumentReference[] = parents.slice(0)
      newParents.push(targetNodeDocRef)
      this.processNodeEvents(nestLevel + 1, subSnap, newParents, listener)
    })
  }

  nodesPath(path) {
    return path.map(ref => {
      let segments = ref._key.path.segments
      return segments[segments.length - 1] // hack: probably replace with change.doc.id
    })
  }


  // addNode(parentId: string) {
  //   debugLog('add node to parent to db:', parentId)
  //   this.nodesCollection().add({
  //     title: 'added node title'
  //   }).then(result => {
  //     const childDoc: firebase.firestore.DocumentReference = result
  //     const childId = childDoc.id
  //     const nodeInclusion: FirestoreNodeInclusion = {
  //       childNode: db.collection(this.ITEMS_COLLECTION).doc(childId),
  //       orderNum: 9999
  //     }
  //     if ( parentId ) {
  //       // this.addNodeInclusionToParent(parentId, nodeInclusion)
  //     } else {
  //       db.collection(this.ROOTS_COLLECTION).add(nodeInclusion)
  //     }
  //   })
  // }

  private itemsCollection() {
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
                                   childNode: OryTreeNode, itemDocRef: DocumentReference
  ) {
    const nodeInclusionFirebaseObject: FirestoreNodeInclusion = {
      // childNode: this.itemDocById(childNode.dbId),
      childNode: itemDocRef,
      orderNum: nodeInclusion.orderNum,
      nodeInclusionId: nodeInclusion.nodeInclusionId
    }
    // this.subNodesCollectionForItem(parentId).add(nodeInclusionFirebaseObject)
    this.subNodesCollectionForItem(parentId).doc(nodeInclusion.nodeInclusionId).set(nodeInclusionFirebaseObject)
  }

  private subNodesCollectionForItem(parentId: string) {
    return this.itemsCollection().doc(parentId).collection('subNodes')
  }

// TODO:
// to as little as possible in vendor specific class (FirestoreTreeService)
// pre-calculate next/previous order in TreeModel
  addNodeToDb(parent, nodeBefore, odeAfter, orderBefore, orderAfter) {

  }

  /* TODO: should be called *create*, because it is a completely new node/item involving db, vs addChild just looks like tree-only operation */
  addSiblingAfterNode(parentNode: OryTreeNode, newNode: OryTreeNode, afterExistingNode: OryTreeNode, previousOrderNumber, newOrderNumber, nextOrderNumber) {
    console.log('addSiblingAfterNode', newNode, afterExistingNode)
    // let parentId = afterExistingNode.parent2.dbId // will not work yet; "imaginary root"
    // let parentId = this.HARDCODED_ROOT_NODE // HACK to simplify for now
    let parentId = parentNode.itemId // HACK to simplify for now
    // console.log('addSiblingAfterNode nodeBelow', nodeBelow)
    // add node itself to firestore (BEFORE inclusion)
    const newItem = {
      // title: 'added node title ' + new Date()
      title: OryTreeNode.INITIAL_TITLE
    }

    this.itemsCollection().doc(newNode.itemId).set(newItem).then((itemDocRef) => {
      itemDocRef = this.itemDocById(newNode.itemId)
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
    FIXME()
    // throw new Error('TESTING')

    // TODO: return nodeInclusion? (could be useful if it was not provided as an argument)
  }

  patchItemData(itemId: string, itemData: any) {
    return this.itemDocById(itemId).update(itemData)
  }

  patchChildInclusionData(parentItemId: string, itemInclusionId: string, itemInclusionData: any) {
    debugLog('patchChildInclusionData', arguments)
    return this.subNodesCollectionForItem(parentItemId).doc(itemInclusionId).update(itemInclusionData)
  }

}
