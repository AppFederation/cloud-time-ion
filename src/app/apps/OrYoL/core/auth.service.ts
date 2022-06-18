import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
// import { auth } from 'firebase/app';
import { CoreModule } from './core.module'
// import * as firebase from 'firebase'
import { auth } from 'firebase'


export type UserId = string

@Injectable(
  // {
  // providedIn: CoreModule /* CoreModule caused TS circular dependency warning */
  // /* TODO: investigate https://medium.com/@tomastrajan/total-guide-to-angular-6-dependency-injection-providedin-vs-providers-85b7a347b59f ,
  //   https://stackoverflow.com/questions/50860898/angular-6-services-providedin-root-vs-coremodule */
  // }
)
export class AuthService {

  public userId?: UserId

  constructor(
    // private angularFireAuth: AngularFireAuth,
  ) {

  }

  requestSignIn() {
    const provider = new auth.GoogleAuthProvider();
    auth().signInWithPopup(provider).then(result => {
    // this.angularFireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then((result) => {
      // FIXME handle nullish user?
      this.userId = result.user!.uid
      console.log('signInWithPopup', this.userId, result)
    })
  }

}
