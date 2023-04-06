import {OdmBackend} from "../../AppFedShared/odm/OdmBackend";
import {FirestoreOdmCollectionBackend} from "./FirestoreOdmCollectionBackend";
import {Injectable, Injector} from "@angular/core";
import {debugLog, errorAlert} from "../../AppFedShared/utils/log";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {OdmItem} from "../../AppFedShared/odm/OdmItem";

/**
 *
 * Alternatives from AWS:
 * https://stackoverflow.com/questions/39589636/what-would-be-the-aws-equivalent-to-firebase-realtime-database
 * https://aws.amazon.com/es/amplify/
 * https://aws.amazon.com/es/appsync/
 * https://dashbird.io/blog/aws-lambda-vs-firebase/
 * DynamoDB somewhat
 *
 * Default/common queries params
 *  - read/owner (permission) - mandatory! coz otherwise permission error!
 *  - ...... You can use at most one **array-contains** clause per query. You can't combine array-contains with array-contains-any.
 *  - part-of parent element (most probably not array-contains, coz would collide with read permissions array-contains
 *  - >= timestamp - newer than (last-modified) - You can perform range (<, <=, >, >=) or not equals (!=) comparisons only on a single field, and you can include at most one array-contains or array-contains-any clause in a compound query:
 * */
@Injectable()
export class FirestoreOdmBackend extends OdmBackend {

  constructor(
    injector: Injector,
    protected angularFirestore: AngularFirestore
  ) {
    super(injector)
    this.initDb()
  }

  createCollectionBackend<T extends OdmItem<T>>(injector: Injector, className: string)
      : FirestoreOdmCollectionBackend<any /* hack after strict */>
  {
    return new FirestoreOdmCollectionBackend<T>(injector, className, this)
  }

  protected initDb() {
    this.angularFirestore.firestore.enablePersistence({
      synchronizeTabs: true
    }).then(() => {
      // window.alert('persistence enabled')
      debugLog('Firestore persistence enabled')
      this.authService.authUser$.subscribe(user => {
        if ( user ) {
          this.backendReady$.nextWithCache(true)
        }
      })
    }).catch((caught: any) => {
      errorAlert('Firestore enablePersistence error', caught)
    })
  }
}
