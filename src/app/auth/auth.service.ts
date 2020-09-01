import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ignorePromise } from '../libs/AppFedShared/utils/promiseUtils';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import {errorAlert} from '../libs/AppFedShared/utils/log'
import {CachedSubject} from '../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {User} from 'firebase'

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  authUser$ = new CachedSubject<User | null>();

  private _userIsAuthenticated = false;

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
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
    return this.afAuth.auth.signOut();
  }

  signUpWithEmailAndPassword(email: string, password: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(response => (this.login()/*, this.Router.navigateByUrl('/timers') /!* TODO why comma expression *!/)*/))
      .catch(error => console.log('Error on creating account', error));
  }

  logInViaEmailAndPassword(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(response => (this.login()/*, this.Router.navigateByUrl('/timers'))*/))
      .catch(error => console.log('Error logging in', error));
  }

  logInViaGoogle() {
    const authProvider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.auth
      .signInWithPopup(authProvider)
      .then(response => (this.login()/*, this.Router.navigateByUrl('/timers')*/)
        /* TODO: emit authUser$ */
      )
      .catch(error => errorAlert('Error logging in via Google ' + error));
  }
}
