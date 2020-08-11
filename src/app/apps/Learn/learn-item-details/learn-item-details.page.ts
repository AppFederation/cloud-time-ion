import { Component, OnInit } from '@angular/core';
import {SideId, SidesDefs, sidesDefs, sidesDefsArray} from '../core/sidesDefs'
import {ActivatedRoute, Router} from '@angular/router'
import {LearnDoService} from '../core/learn-do.service'
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore'
import {AlertController} from '@ionic/angular'
import {FormControl, FormGroup} from '@angular/forms'
import {mapFieldsToFormControls} from '../../../libs/AppFedShared/utils/dictionary-utils'
import {ViewSyncer} from '../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {LearnItem, LearnItemId} from '../models/LearnItem'
import {ignorePromise} from '../../../libs/AppFedShared/utils/promiseUtils'
import {Observable} from 'rxjs/internal/Observable'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {LearnItem$} from '../models/LearnItem$'

@Component({
  selector: 'app-learn-item-details',
  templateUrl: './learn-item-details.page.html',
  styleUrls: ['./learn-item-details.page.sass'],
})
export class LearnItemDetailsPage implements OnInit {

  get val$(): Observable<LearnItem | nullish> {
    return this.item$.locallyVisibleChanges$
  }

  // formControls: {[key: keyof SidesDefs]: FormControl} =
  formControls: {[key: string]: FormControl /* TODO: mapped type */} = mapFieldsToFormControls(sidesDefs)

  formGroup = new FormGroup(this.formControls)

  window = window
  sidesDefsArray = sidesDefsArray

  public id: LearnItemId = this.activatedRoute.snapshot.params['itemId']
  public item$: LearnItem$ = this.learnDoService.getItem$ById(this.id)
  public title? : string

  public viewSyncer = new ViewSyncer(this.formGroup, this.item$)

  constructor(
    public activatedRoute: ActivatedRoute,
    protected learnDoService: LearnDoService,
    protected angularFirestore: AngularFirestore,
    public alertController: AlertController,
    private router: Router,
  ) {
  }

  private doc: AngularFirestoreDocument<LearnItem> = this.angularFirestore.collection<LearnItem>(`LearnItem`).doc(this.id)

  tinyMceInit = {
    height: 500,
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    toolbar:
      'undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | help',
    skin: 'oxide-dark',
    content_css: 'dark',  // > **Note**: This feature is only available for TinyMCE 5.1 and later.
    entity_encoding: `raw`,
  }

  showTextAreas = false

  ngOnInit() {
    // console.log(`id`, this.id)
    // console.log(`this.learnDoService.itemsCount`, this.learnDoService.itemsCount())

    // this.learnDoService.localItems$.subscribe(items => {
    //   console.log(`this.learnDoService.localItems$ items.length`, items.length, 'itemsCount', this.learnDoService.itemsCount())
    // })
    // console.log(`this.item$.currentVal`, this.item$.currentVal, this.item$.locallyVisibleChanges$.lastVal)
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
