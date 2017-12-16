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
    console.log(args)
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

export const ORDER_STEP = 1 * 1000 * 1000

export interface FirestoreNodeInclusion {
  childNode    : DocumentReference,
  orderNum: number,
  nodeInclusionId: string
}


@Injectable()
export class FirestoreTreeService extends DbTreeService {

  static dbPrefix = 'dbEmptyZZZ__5'



  pendingListeners = 0


  private NODES_COLLECTION = FirestoreTreeService.dbPrefix + 'nodes'
  private ROOTS_COLLECTION = FirestoreTreeService.dbPrefix + 'roots'

  private HARDCODED_ROOT_NODE = 'KarolNodesHardcoded'

  constructor() {
    super()
    // db.enablePersistence().then(() => {
    //   // window.alert('persistence enabled')
    // })
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

  delete(id) {
    db.collection('test1').doc(id).delete()
  }


  loadNodesTree(listener: DbTreeListener) {
    console.log('loadNodesTree')
    db.collection(this.ROOTS_COLLECTION).onSnapshot(snapshot => {
      console.log('loadNodesTree onSnapshot()', snapshot)
    })
    // this.processNodeEvents(0, snapshot, [], listener)
    this.handleSubNodes(this.nodeDocById(this.HARDCODED_ROOT_NODE), [], 0, listener)
  }

  private processNodeEvents(nestLevel: number, snapshot: QuerySnapshot, parents: DocumentReference[], listener: DbTreeListener) {
    const serviceThis = this
    snapshot.docChanges.forEach(function(change) {
      const nodeInclusionData = change.doc.data() as FirestoreNodeInclusion
      if (change.type === 'added') {
        const parentsPath = serviceThis.nodesPath(parents)
        debugLog('added node inclusion event: ', nestLevel, parentsPath, nodeInclusionData);
        serviceThis.pendingListeners ++
        nodeInclusionData.childNode.onSnapshot((targetNodeDoc: DocumentSnapshot) => {
          serviceThis.pendingListeners --
          // const nodeInclusionId = change.doc.id FIXME()
          const nodeInclusionId = nodeInclusionData.nodeInclusionId
          console.log('nodeInclusionId', nodeInclusionId)
          const nodeInclusion = new NodeInclusion(nodeInclusionData.orderNum, nodeInclusionId)
          listener.onNodeAdded(
            new NodeAddEvent(parentsPath, parentsPath[parentsPath.length - 1], targetNodeDoc, targetNodeDoc.id,
              serviceThis.pendingListeners, nodeInclusion))
          debugLog('target node:', nestLevel, targetNodeDoc)
          // debugLog('target node title:', nestLevel, targetNodeDoc.data().title)
          serviceThis.handleSubNodes(targetNodeDoc.ref, parents, nestLevel, listener)
        })
        // debugLog('root node ref: ', targetNode);
      }
      if (change.type === 'modified') {
        debugLog('Modified city: ', nodeInclusionData);
      }
      if (change.type === 'removed') {
        debugLog('Removed city: ', nodeInclusionData);
      }
    })
  }

  private handleSubNodes(targetNodeDocRef: DocumentReference, parents: DocumentReference[], nestLevel: number, listener: DbTreeListener) {
    const subCollection = targetNodeDocRef.collection('subNodes')
    debugLog('subColl:', subCollection)
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
  //       childNode: db.collection(this.NODES_COLLECTION).doc(childId),
  //       orderNum: 9999
  //     }
  //     if ( parentId ) {
  //       // this.addNodeInclusionToParent(parentId, nodeInclusion)
  //     } else {
  //       db.collection(this.ROOTS_COLLECTION).add(nodeInclusion)
  //     }
  //   })
  // }

  private nodesCollection() {
    return db.collection(this.NODES_COLLECTION)
  }

  moveNode(dbId: string, dbId2: string) {
    this.nodeDocById(dbId2).collection('subNodes').add({
      node: this.nodeDocById(dbId)
    })
    // db.collection(this.node)
  }

  private nodeDocById(dbId: string): DocumentReference {
    return this.nodesCollection().doc(dbId)
  }

  private addNodeInclusionToParent(parentId: string, nodeInclusion: NodeInclusion /*{ node: firebase.firestore.DocumentReference }*/,
                                   childNode: OryTreeNode
  ) {
    const nodeInclusionFirebaseObject: FirestoreNodeInclusion = {
      childNode: this.nodeDocById(childNode.dbId),
      orderNum: nodeInclusion.orderNum,
      nodeInclusionId: nodeInclusion.nodeInclusionId
    }
    this.nodesCollection().doc(parentId).collection('subNodes').add(nodeInclusionFirebaseObject)
  }

  // TODO:
// to as little as possible in vendor specific class (FirestoreTreeService)
// pre-calculate next/previous order in TreeModel
  addNodeToDb(parent, nodeBefore, odeAfter, orderBefore, orderAfter) {

  }


  addSiblingAfterNode(newNode: OryTreeNode, afterExistingNode: OryTreeNode, previousOrderNumber, newOrderNumber, nextOrderNumber) {
    console.log('addSiblingAfterNode', newNode, afterExistingNode)
    // let parentId = afterExistingNode.parent2.dbId // will not work yet; "imaginary root"
    let parentId = this.HARDCODED_ROOT_NODE // hack to simplify for now
    // console.log('addSiblingAfterNode nodeBelow', nodeBelow)
    // add node itself to firestore (BEFORE inclusion)
    const newItem = {
      title: 'added node title ' + new Date()
    }
    this.nodesCollection().add(newItem).then(() => {
      this.addNodeInclusionToParent(parentId, newNode.nodeInclusion, newNode)
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

    // TODO: return nodeInclusion? (could be useful if it was not provided as an argument)
  }

  static calculateNewOrderNumber(previousOrderNumber: number, nextOrderNumber: number) {
    console.log('calculateNewOrderNumber: ', previousOrderNumber, nextOrderNumber)
    let newOrderNumber
    if ( nullOrUndef(previousOrderNumber) && defined(nextOrderNumber) ) {
      newOrderNumber = nextOrderNumber - ORDER_STEP
    } else if ( defined(previousOrderNumber) && nullOrUndef(nextOrderNumber) ) {
      newOrderNumber = previousOrderNumber + ORDER_STEP
    } else if ( nullOrUndef(previousOrderNumber) && nullOrUndef(nextOrderNumber) ) {
      newOrderNumber = 0
    } else { /* both next and previous is defined */
      newOrderNumber = ( previousOrderNumber + nextOrderNumber ) / 2;
    }

    if (nextOrderNumber === newOrderNumber || previousOrderNumber === newOrderNumber) {
      window.alert(`Order number equal: new:${newOrderNumber},previous:${previousOrderNumber},next:${nextOrderNumber}`)
    }
    return newOrderNumber
  }
}
