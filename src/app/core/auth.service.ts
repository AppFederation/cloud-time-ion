import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' /* TODO: investigate https://medium.com/@tomastrajan/total-guide-to-angular-6-dependency-injection-providedin-vs-providers-85b7a347b59f ,
    https://stackoverflow.com/questions/50860898/angular-6-services-providedin-root-vs-coremodule */
})
export class AuthService {

  constructor() { }

  requestSignIn() {

  }

}
