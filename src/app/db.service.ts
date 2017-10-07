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
    db.enablePersistence().then(() => {
      // window.alert('persistence enabled')
    })
    this.listenToChanges(onSnapshotHandler)
  }

  addItem() {
    db.collection('test1').add({
      testField: 'test ' + new Date()
    })
  }

  listenToChanges(func) {
    db.collection('test1')
      .onSnapshot(func);
  }

}
