import { Injectable } from '@angular/core';

const firebase = require('firebase');
// Required for side-effects
require('firebase/firestore');


firebase.initializeApp({
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
const db = firebase.firestore();

@Injectable()
export class DbService {

  constructor() {
    this.loadNodesTree()
    // db.enablePersistence().then(() => {
    //   // window.alert('persistence enabled')
    // })
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

  private loadNodesTree() {
    db.collection('roots').onSnapshot(snapshot => {
      this.processNodeEvents(0, snapshot)
    })
  }

  private processNodeEvents(nestLevel: number, snapshot: any) {
    const serviceThis = this
    snapshot.docChanges.forEach(function(change) {
      let data = change.doc.data()
      if (change.type === 'added') {
        console.log('node: ', nestLevel, data);
        data.node.onSnapshot(targetNodeDoc => {
          console.log('target node:', nestLevel, targetNodeDoc)
          console.log('target node title:', nestLevel, targetNodeDoc.data().title)

          const subCollection = targetNodeDoc.ref.collection('subNodes')
          console.log('subColl:', subCollection)
          subCollection.onSnapshot(subSnap => {
            serviceThis.processNodeEvents(nestLevel + 1, subSnap)
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

}
