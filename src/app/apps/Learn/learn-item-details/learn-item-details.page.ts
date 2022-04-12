import { Component, OnInit } from '@angular/core';
import {sidesDefsArray} from '../core/sidesDefs'
import {ActivatedRoute, NavigationStart, Router} from '@angular/router'
import {LearnDoService} from '../core/learn-do.service'
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore'
import {AlertController} from '@ionic/angular'
import {LearnItem, LearnItemId} from '../models/LearnItem'
import {ignorePromise} from '../../../libs/AppFedShared/utils/promiseUtils'
import {Observable} from 'rxjs'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {LearnItem$} from '../models/LearnItem$'
import {NavigationService} from '../../../shared/navigation.service'
import {filter} from 'rxjs/operators'

@Component({
  selector: 'app-learn-item-details',
  templateUrl: './learn-item-details.page.html',
  styleUrls: ['./learn-item-details.page.sass'],
})
export class LearnItemDetailsPage implements OnInit {

  get val$(): Observable<LearnItem | nullish> {
    return this.item$.locallyVisibleChanges$
  }

  window = window

  sidesDefsArray = sidesDefsArray

  public id: LearnItemId = this.activatedRoute.snapshot.params['itemId']
  public item$: LearnItem$ = this.learnDoService.obtainItem$ById(this.id)
  public title? : string

  constructor(
    public activatedRoute: ActivatedRoute,
    public learnDoService: LearnDoService,
    public angularFirestore: AngularFirestore,
    public alertController: AlertController,
    public router: Router,
    public navigationService: NavigationService,
  ) {
    // router.events.pipe(
    //   filter(event => event instanceof NavigationStart) /* Using NavigationStart coz could be good if quickly clicking next next */
    // ).subscribe((event: NavigationStart) => {
    //   this.navigationService.currentItemId = event.
    // });
    this.activatedRoute.params.subscribe((params)=>{
      this.navigationService.setCurrenItemId(params['itemId'])
    });
  }

  private doc: AngularFirestoreDocument<LearnItem> = this.angularFirestore.collection<LearnItem>(`LearnItem`).doc(this.id)

  ngOnInit() {
  }

  async askDelete() {
    const alert = await this.alertController.create({
      header: 'Delete item ' + this.item$ ?. currentVal ?. title + " ?",
      message: 'Delete <strong>' + this.item$ ?. currentVal ?. joinedSides ?. () + '</strong>!!!?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'DELETE',
          handler: async () => {
            // this.doc.update({
            //   whenDeleted: new Date(),
            // })
            await this.doc.delete() // TODO: listen to promise for sync status
            await this.angularFirestore.collection(`LearnDoAudio`).doc(this.id).delete() // TODO: listen to promise for sync status
            ignorePromise(this.router.navigate([`/learn`]))
          }
        }
      ]
    })
    await alert.present()
  }

}
