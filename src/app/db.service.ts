import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app'
import QuerySnapshot = firebase.firestore.QuerySnapshot

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


function onSnapshotHandler(snapshot) {
  snapshot.docChanges.forEach(function(change) {
    if (change.type === 'added') {
      console.log('New city: ', change.doc.data());
    }
    if (change.type === 'modified') {
      console.log('Modified city: ', change.doc.data());
    }
    if (change.type === 'removed') {
      console.log('Removed city: ', change.doc.data());
    }
  });
}

// Initialize Cloud Firestore through Firebase
const db = firebase1.firestore();

export class NodeAddEvent {
  constructor (
    public parents,
    public immediateParentId,
    public node,
    public id,
    public pendingListeners: number,
  ) {}
}

export abstract class DbTreeListener {
  abstract onNodeAdded(NodeAddEvent)
}

@Injectable()
export class DbService {

  pendingListeners = 0

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
    db.collection('roots').onSnapshot(snapshot => {
      this.processNodeEvents(0, snapshot, [], listener)
    })
  }

    private processNodeEvents(nestLevel: number, snapshot: any, parents, listener: DbTreeListener) {
      const serviceThis = this
      snapshot.docChanges.forEach(function(change) {
        let data = change.doc.data()
        if (change.type === 'added') {
          const parentsPath = serviceThis.nodesPath(parents)
          console.log('node: ', nestLevel, parentsPath, data);
          serviceThis.pendingListeners ++
          data.node.onSnapshot(targetNodeDoc => {
            serviceThis.pendingListeners --
            listener.onNodeAdded(
              new NodeAddEvent(parentsPath, parentsPath[parentsPath.length - 1], targetNodeDoc, targetNodeDoc.id,
                serviceThis.pendingListeners))
            console.log('target node:', nestLevel, targetNodeDoc)
            console.log('target node title:', nestLevel, targetNodeDoc.data().title)

            const subCollection = targetNodeDoc.ref.collection('subNodes')
            console.log('subColl:', subCollection)
            subCollection.onSnapshot((subSnap: QuerySnapshot) => {
              const newParents = parents.slice(0)
              newParents.push(targetNodeDoc.ref)
              serviceThis.processNodeEvents(nestLevel + 1, subSnap, newParents, listener)
            })
          })
          // console.log('root node ref: ', targetNode);
        }
        if (change.type === 'modified') {
          console.log('Modified city: ', data);
        }
        if (change.type === 'removed') {
          console.log('Removed city: ', data);
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
    console.log('add node to parent to db:', parentId)
    db.collection('nodes').add({
      title: 'added node title'
    }).then(result => {
      const childDoc: firebase.firestore.DocumentReference = result
      const childId = childDoc.id
      if ( parentId ) {
        db.collection('nodes').doc(parentId).collection('subNodes').add({
          node: db.collection('nodes').doc(childId)
        })
      } // FIXME: add to root
    })
  }

}
