import { TimersPageComponent } from './../timers/timers-page.component';
import { Injectable } from '@angular/core';
import { CachedSubject } from '../libs/AppFedShared/utils/CachedSubject';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ignorePromise } from '../libs/AppFedShared/utils/promiseUtils';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUser$ = new CachedSubject<any>();
  private _userIsAuthenticated = false;
  errorMessage = null;
  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }
  constructor(
    private angularFirestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private Router: Router,
    public alertController: AlertController
  ) {
    this.afAuth.authState.subscribe(authState => {
      console.log('authState', authState);
    });
    ignorePromise(
      /* TODO: only use this if User chooses this instead of Google, to avoid creating data somewhere where it is not gonna be accessible on another device */
      this.afAuth.auth.signInAnonymously(),
      'this.angularFireAuth.auth.signInAnonymously()'
    );
  }
  public handleError(error) {
    if (typeof error === 'object') {
      this.errorMessage = error.message;
    }
    if (typeof error === 'string') {
      this.errorMessage = error;
    }
    return this.errorMessage;
  }
  login() {
    this._userIsAuthenticated = true;
  }
  logout() {
    this.alertController
      .create({
        header: 'Warning!',
        message: 'You have been logged out!',
        buttons: ['OK']
      })
      .then(alertEl => {
        alertEl.present();
      });
    this._userIsAuthenticated = false;

    return this.afAuth.auth.signOut();
  }

  signUpWithEmailAndPassword(email, password: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(response => (this.login(), this.Router.navigateByUrl('/timers')))
      .catch(error => this.handleError(error));
  }

  logInViaEmailAndPassword(email, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(response => (this.login(), this.Router.navigateByUrl('/timers')))
      .catch(error => this.handleError(error));
  }
}
