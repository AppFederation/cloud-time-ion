import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app'
import QuerySnapshot = firebase.firestore.QuerySnapshot
import {DbTreeListener, NodeAddEvent} from './TreeListener'

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

const enableLogging = false

export function debugLog(...args) {
  if ( enableLogging ) {
    console.log(args)
  }
}

function onSnapshotHandler(snapshot) {
  snapshot.docChanges.forEach(function(change) {
    if (change.type === 'added') {
      debugLog('New city: ', change.doc.data());
    }
    if (change.type === 'modified') {
      debugLog('Modified city: ', change.doc.data());
    }
    if (change.type === 'removed') {
      debugLog('Removed city: ', change.doc.data());
    }
  });
}

// Initialize Cloud Firestore through Firebase
const db = firebase1.firestore();


@Injectable()
export class FirestoreTreeService {

  static dbPrefix = 'dbOrder'

  pendingListeners = 0


  private NODES_COLLECTION = FirestoreTreeService.dbPrefix + 'nodes'
  private ROOTS_COLLECTION = FirestoreTreeService.dbPrefix + 'roots'

  constructor() {
    db.enablePersistence().then(() => {
      // window.alert('persistence enabled')
    })
    this.listenToChanges(onSnapshotHandler)
  }

  addItem() {
    db.collection('test1').add({
      testField: 'test ' + new Date(),
      testField2: new Date(),
      testField3: 10,
    })
  }

  listenToChanges(func) {
    db.collection('test1')
      .onSnapshot(func);
  }

  delete(id) {
    db.collection('test1').doc(id).delete()
  }


  loadNodesTree(listener: DbTreeListener) {
    db.collection(this.ROOTS_COLLECTION).onSnapshot(snapshot => {
      this.processNodeEvents(0, snapshot, [], listener)
    })
  }

  private processNodeEvents(nestLevel: number, snapshot: any, parents, listener: DbTreeListener) {
    const serviceThis = this
    snapshot.docChanges.forEach(function(change) {
      const nodeInclusionData = change.doc.data()
      if (change.type === 'added') {
        const parentsPath = serviceThis.nodesPath(parents)
        debugLog('node: ', nestLevel, parentsPath, nodeInclusionData);
        serviceThis.pendingListeners ++
        nodeInclusionData.node.onSnapshot(targetNodeDoc => {
          serviceThis.pendingListeners --
          listener.onNodeAdded(
            new NodeAddEvent(parentsPath, parentsPath[parentsPath.length - 1], targetNodeDoc, targetNodeDoc.id,
              serviceThis.pendingListeners, nodeInclusionData))
          debugLog('target node:', nestLevel, targetNodeDoc)
          debugLog('target node title:', nestLevel, targetNodeDoc.data().title)

          const subCollection = targetNodeDoc.ref.collection('subNodes')
          debugLog('subColl:', subCollection)
          subCollection.onSnapshot((subSnap: QuerySnapshot) => {
            const newParents = parents.slice(0)
            newParents.push(targetNodeDoc.ref)
            serviceThis.processNodeEvents(nestLevel + 1, subSnap, newParents, listener)
          })
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

  nodesPath(path) {
    return path.map(ref => {
      let segments = ref._key.path.segments
      return segments[segments.length - 1] // hack: probably replace with change.doc.id
    })
  }


  addNode(parentId: string) {
    debugLog('add node to parent to db:', parentId)
    db.collection(this.NODES_COLLECTION).add({
      title: 'added node title'
    }).then(result => {
      const childDoc: firebase.firestore.DocumentReference = result
      const childId = childDoc.id
      if ( parentId ) {
        this.nodesCollection().doc(parentId).collection('subNodes').add({
          node: db.collection(this.NODES_COLLECTION).doc(childId)
        })
      } else {
        db.collection(this.ROOTS_COLLECTION).add({
          node: db.collection(this.NODES_COLLECTION).doc(childId)
        })
      }
    })
  }

  private nodesCollection() {
    return db.collection(this.NODES_COLLECTION)
  }

  moveNode(dbId: string, dbId2: string) {
    this.nodeDocById(dbId2).collection('subNodes').add({
      node: this.nodeDocById(dbId)
    })
    // db.collection(this.node)
  }

  private nodeDocById(dbId: string) {
    return this.nodesCollection().doc(dbId)
  }
}
