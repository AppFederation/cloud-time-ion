import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ignorePromise } from '../libs/AppFedShared/utils/promiseUtils';
import { Router } from '@angular/router';

// import * as firebase from 'firebase/app';
import {errorAlert} from '../libs/AppFedShared/utils/log'
import {CachedSubject} from '../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
// import {User} from 'firebase/compat'
import {ChromeExtensionService} from '../apps/Learn/shared/utils/chrome-extension.service'
import firebase from 'firebase/compat'
import User = firebase.User
import {nullish} from '../libs/AppFedShared/utils/type-utils'


export type UserId = string

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  authUser$ = new CachedSubject<User | null>();

  private _userIsAuthenticated = false;

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  /** this was required by stuff OrYoL AuthService */
  get userId(): UserId | nullish {
    return this.authUser$.lastVal?.uid
  }

  constructor(
    private angularFirestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private Router: Router
  ) {
    this.afAuth.authState.subscribe(authState => {
      console.log('authState', authState?.uid, authState);
      this.authUser$.next(authState)
    });
    // ignorePromise(
    //   /* TODO: only use this if User chooses this instead of Google, to avoid creating data somewhere where it is not gonna be accessible on another device */
    //   this.afAuth.auth.signInAnonymously(),
    //   'this.angularFireAuth.auth.signInAnonymously()'
    // );
  }

  login() {
    this._userIsAuthenticated = true;
  }

  logout() {
    this._userIsAuthenticated = false;
    // this.afAuth.auth.signOut(); // https://github.com/angular/angularfire/blob/master/docs/version-6-upgrade.md
    this.afAuth.signOut(); // https://github.com/angular/angularfire/blob/master/docs/version-6-upgrade.md
    this.authUser$.next(null)
  }

  signUpWithEmailAndPassword(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((response: any) => (this.login()/*, this.Router.navigateByUrl('/timers') /!* TODO why comma expression *!/)*/))
      .catch((error: any) => console.log('Error on creating account', error));
  }

  logInViaEmailAndPassword(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((response: any) => (this.login()/*, this.Router.navigateByUrl('/timers'))*/))
      .catch((error: any) => console.log('Error logging in', error));
  }

  logInViaGoogle() {
    if (ChromeExtensionService.isApplicationRunAsChromeExtension()) {
      // @ts-ignore
      chrome.runtime.sendMessage({
        command: 'login'
      }, (response) => {
        console.log('Log  in response===', response);
      });
    } else {
      const authProvider = new firebase.auth.GoogleAuthProvider();
      return this.afAuth
        .signInWithPopup(authProvider)
        .then((response: any) => (this.login()/*, this.Router.navigateByUrl('/timers')*/)
          /* TODO: emit authUser$ */
        )
        .catch((error: any) => errorAlert('Error logging in via Google ' + error));
    }
  }
}
