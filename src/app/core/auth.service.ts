import { Injectable } from '@angular/core';
import {CachedSubject} from "../utils/CachedSubject";
import {AngularFirestore} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import {ignorePromise} from "../utils/promiseUtils";
import {CoreModule} from "./core.module";

@Injectable({
  providedIn: CoreModule
})
export class AuthService {

  authUser$ = new CachedSubject<any>()

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
  ) {
    this.angularFireAuth.authState.subscribe(authState => {
      console.log('authState', authState)
    })
    ignorePromise(
      /* TODO: only use this if User chooses this instead of Google, to avoid creating data somewhere where it is not gonna be accessible on another device */
      this.angularFireAuth.auth.signInAnonymously(), 'this.angularFireAuth.auth.signInAnonymously()')
  }

  openLoginViaGoogleDialog() {

  }

}
