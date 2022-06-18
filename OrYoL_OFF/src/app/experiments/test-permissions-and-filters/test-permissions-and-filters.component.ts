// import { Component, OnInit } from '@angular/core';
//
// const firebase1 = require('firebase');
// // Required for side-effects
// require('firebase/firestore');
//
// // Initialize Cloud Firestore through Firebase
// const db = firebase1.firestore();
//
//
// // service cloud.firestore {
// //   match /databases/{database}/documents {
// //     match /{document=**} {
// //       // allow read, write: if true;
// //       match /test-perm-fil/{roomId} {
// //         allow read: if get(/databases/$(database)/documents/test-perm-fil/$(roomId)).data.permission_KAROL == true;
// //       }
// //     }
// //   }
// // }
//
// // / ========
// // service cloud.firestore {
// //   match /databases/{database}/documents {
// //     match /projects/{projectID} {
// //       // A user can update a project if they're listed in the project's
// //       // "members" array. Or if the project is a "all-access" project.
// //       allow update: if request.auth.uid in get(/databases/$(database)/documents/projects/$(projectID)).data.members ||
// //       get(/databases/$(database)/documents/projects/$(projectID)).data.accessType == "all-access";
// //       match /{allChildren=**} {
// //         // The same thing holds true for subcollections of this project
// //         allow update: if request.auth.uid in get(/databases/$(database)/documents/projects/$(projectID)).data.members ||
// //         get(/databases/$(database)/documents/projects/$(projectID)).data.accessType == "all-access";
// //       }
// //     }
// //   }
// // }
//
//
// // https://firebase.google.com/docs/firestore/security/secure-data
// // =====
// // service cloud.firestore {
// //   match /databases/{database}/documents {
// //     match /projects/{projectID} {
// //
// //       function canUserUpdateProject() {
// //         return request.auth.uid in get(/databases/$(database)/documents/project/$(projectID)).data.members ||
// //         get(/databases/$(database)/documents/projects/$(projectID)).data.accessType == "all-access";
// //       }
// //
// //       allow update: if canUserUpdateProject();
// //       match /{allChildren=**} {
// //         allow update: if canUserUpdateProject();
// //       }
// //     }
// //   }
// // }
//
// @Component({
//   selector: 'app-test-permissions-and-filters',
//   templateUrl: './test-permissions-and-filters.component.html',
//   styleUrls: ['./test-permissions-and-filters.component.scss']
// })
// export class TestPermissionsAndFiltersComponent implements OnInit {
//
//   constructor() { }
//
//   ngOnInit() {
//     const databaseName = '(default)'
//     console.log('will query with filter')
//     // db.collection('test-perm-fil').where('permission_KAROL', '==', true).onSnapshot(snapshot => {
//     // db.collection('test-perm-fil').where('permission.KAROL', '==', true).onSnapshot(snapshot => {
//     // db.collection('test-perm-fil').where(`permission.${databaseName}`, '==', true).onSnapshot(snapshot => {
//     db.collection('test-perm-fil').where(`permission.${databaseName}`, '>=', 15).onSnapshot(snapshot => {
//     // db.collection('test-perm-fil').onSnapshot(snapshot => {
//       console.log('snapshot', snapshot)
//     })
//
//
//
//     // service cloud.firestore {
//     //   match /databases/{database}/documents {
//     //     match /test-perm-fil/{roomId} {
//     //       // allow read: if get(/databases/$(database)/documents/test-perm-fil/$(roomId)).data.permission_KAROL == true;
//     //       // allow read: if resource.data.permission.KAROL == true; // !! WORKS !!
//     //       allow read: if resource.data.permission.$(database) == true; //unexpected '$' ; SOLUTION -->
//     // --> store it in 2 places: in a field, for query, and in another collection, for security rules.
//     // better ---> allow read: if resource.data.permission[database] == true; // WORKS
//     //       // allow read: if roomId == "XWP96LF4j73lhgd7IWf6";
//     //       //allow read, write: if true;
//     //     }
//     //   }
//     // }
//
//
//     // service cloud.firestore {
//     //   match /databases/{database}/documents {
//     //     match /test-perm-fil/{roomId} {
//     //       allow read: if resource.data.permission[database] > 0; // *** NUMBER ***
//     //     }
//     //   }
//     // }
//
//     // ==== https://firebase.google.com/docs/firestore/solutions/arrays :
//     // Find all documents in the 'posts' collection that are
// // in the 'cats' category.
// //     db.collection('posts')
// //       .where('categories.cats', '==', true)
// //       .get()
// //       .then(() => {
// //         // ...
// //       });)
//
//
//     // ======== to prevent modifications (e.g. use has permission to edit, but no permission to change permissions:
//     // https://firebase.google.com/docs/firestore/security/secure-data :
//     // // Existing and potential values must be equal
//     // allow update: if request.resource.data.name == resource.data.name;
//
//     // ======== later, to filter only most recent elements, for example, I can use timestamps instead of boolean
//     // https://firebase.google.com/docs/firestore/solutions/arrays :
//     // // The value of each entry in 'categories' is a unix timestamp
//     // {
//     //   title: "My great post",
//     //     categories: {
//     //   technology: 1502144665,
//     //     opinion: 1502144665,
//     //     cats: 1502144665
//     // }
//     // }
//
//     // db.collection('posts')
//     //   .where('categories.cats', '>', 0)
//     //   .orderBy('categories.cats');)
//
//     // IF I need to do multiple criteria (e.g. "most recently viewed or most recently edited", I can do multiple queries
//     // and combine the results in TS code. There might be some overlap of the results, but probably no problem.
//     // I could even have special timestamps somewhere like when-starred or when opened (in subtree)
//
//     // TO keep in mind (might be usefeul some day) :
//     // https://firebase.google.com/docs/firestore/security/secure-data#recursive_matching_with_wildcards
//     // -- match /spaceships/{spaceship=**}
//     //
//     // Algolia: https://firebase.google.com/docs/firestore/solutions/search
//     // https://firebase.google.com/docs/firestore/query-data/query-cursors
//     // "Use a document snapshot to define the query cursor"
//
//     // ==== So I can order by multiple fields?
//     // db.collection("cities")
//     //   .orderBy("name")
//     //   .orderBy("state")
//     //   .startAt("Springfield")
//     // ---- https://firebase.google.com/docs/firestore/query-data/query-cursors
//   }
//
// }
