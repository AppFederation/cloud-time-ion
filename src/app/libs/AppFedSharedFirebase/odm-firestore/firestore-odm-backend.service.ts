import {OdmBackend} from "../../AppFedShared/odm/OdmBackend";
import {FirestoreOdmCollectionBackend} from "./FirestoreOdmCollectionBackend";
import {Injectable, Injector} from "@angular/core";
import {debugLog, errorAlert} from "../../AppFedShared/utils/log";
import {AngularFirestore} from "@angular/fire/firestore";
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
 * */
@Injectable()
export class FirestoreOdmBackend extends OdmBackend {

  constructor(
    protected injector: Injector,
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
    this.angularFirestore.firestore.enablePersistence().then(() => {
      // window.alert('persistence enabled')
      debugLog('Firestore persistence enabled')
      this.authService.authUser$.subscribe(user => {
        if ( user ) {
          this.backendReady$.nextWithCache(true)
        }
      })
    }).catch((caught) => {
      errorAlert('Firestore enablePersistence error', caught)
    })
  }
}
