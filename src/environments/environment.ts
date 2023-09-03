// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  collectionNameSuffix: '',
  // collectionNameSuffix: '_DEBUG',
  firebaseConfig: {
    projectId: 'cloudtime-app',
    apiKey: "AIzaSyD8hiBc7WoQQISCDpDLMtiaakyKvKZwdkw",
    authDomain: "cloudtime-app.firebaseapp.com",
    databaseURL: "https://cloudtime-app.firebaseio.com",
    storageBucket: "cloudtime-app.appspot.com",
    // messagingSenderId: "42917465053"
  },
  production: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
