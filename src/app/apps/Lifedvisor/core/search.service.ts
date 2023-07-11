import { Injectable } from '@angular/core';
// import {AngularFirestore} from '@angular/fire/firestore';
import {isNullishOrWhitespace, trimToNull} from '../utils/string-utils';

export type LiSearch = string

// https://angular.io/guide/singleton-services
// lazy loading: https://angular.io/guide/providers#providing-a-service -- “2. If the service is only used within a lazy loaded module it will be lazy loaded with that module”
// + my question about source & quote
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    // private angularFirestore: AngularFirestore
  ) {
  }

  public onSearchConfirmed(search: LiSearch) {
    if ( ! isNullishOrWhitespace(search) ) {
      // this.angularFirestore.collection('Lifedvisor_Searches').add({
      //   // tslint:disable-next-line:object-literal-shorthand
      //   search: search,
      //   when: new Date(),
      // })
    }
  }

  // patchFieldThrottled(fieldKey: keyof TData, fieldPatch: (typeof this)) {
  //
  // }

}
