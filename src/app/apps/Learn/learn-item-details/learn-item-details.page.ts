import { Component, OnInit } from '@angular/core';
import {SideId, sidesDefsArray} from '../sidesDefs'
import {ActivatedRoute, Router} from '@angular/router'
import {LearnDoService} from '../learn-do.service'
import {LearnItem, LearnItem$, LearnItemId} from '../search-or-add-learnable-item/search-or-add-learnable-item.page'
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore'
import {AlertController} from '@ionic/angular'

@Component({
  selector: 'app-learn-item-details',
  templateUrl: './learn-item-details.page.html',
  styleUrls: ['./learn-item-details.page.sass'],
})
export class LearnItemDetailsPage implements OnInit {

  window = window
  sidesDefsArray = sidesDefsArray

  public id: LearnItemId
  public item$: LearnItem$
  public title: string


  constructor(
    public activatedRoute: ActivatedRoute,
    protected learnDoService: LearnDoService,
    protected angularFirestore: AngularFirestore,
    public alertController: AlertController,
    private router: Router,
  ) {
  }

  private doc: AngularFirestoreDocument<LearnItem>

  ngOnInit() {
    // const msg = new SpeechSynthesisUtterance();

    this.id = this.activatedRoute.snapshot.params['itemId']
    console.log(`id`, this.id)
    console.log(`this.learnDoService.itemsCount`, this.learnDoService.itemsCount())

    this.learnDoService.localItems$.subscribe(items => {
      console.log(`this.learnDoService.localItems$ items.length`, items.length, 'itemsCount', this.learnDoService.itemsCount())
    })
    this.item$ = this.learnDoService.getItem$ById(this.id)
    console.log(`this.item$.currentVal`, this.item$.currentVal, this.item$.locallyVisibleChanges$.lastVal)
    this.item$.locallyVisibleChanges$.subscribe(data => {
      console.log(`locallyVisibleChanges$`, this.item$.id, data)
    })

    this.doc = this.angularFirestore.collection<LearnItem>(`LearnItem`).doc(this.id)
    this.doc.valueChanges().subscribe(x => {
      console.log(`valueChanges`, JSON.stringify(x))
      this.title = x && x.title
      // this.item = x
    })
    // this.item.locallyVisibleChanges$.subscribe(i => {
    //   console.log(`locallyVisibleChanges$`, i)
    // })
    // Set the text.
    // msg.text = this.id;

    // Set the attributes.
    // msg.volume = parseFloat(volumeInput.value);
    // msg.rate = parseFloat(rateInput.value);
    // msg.pitch = parseFloat(pitchInput.value);
    // msg.lang = 'en-US'

    // If a voice has been selected, find the voice and set the
    // utterance instance's voice attribute.
    // if (voiceSelect.value) {
    //   msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == voiceSelect.value; })[0];
    // }

    // Queue this utterance.
    // window.speechSynthesis.speak(msg, );
  }

  async askDelete() {
    const alert = await this.alertController.create({
      header: 'Delete item ' + this.item$.currentVal.title + " ?",
      message: 'Delete <strong>'+ this.item$.currentVal.title +'</strong>!!!',
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
            this.router.navigate([`/learn`])
          }
        }
      ]
    })
    await alert.present()
  }

  getField(tInMemData: LearnItem, fieldId: SideId) {
    if ( tInMemData ) {
      return tInMemData[fieldId]
    } else {
      return null
    }
  }
}
