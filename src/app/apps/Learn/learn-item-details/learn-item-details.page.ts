import { Component, OnInit } from '@angular/core';
import {sidesDefsArray} from '../sidesDefs'
import {ActivatedRoute, Router} from '@angular/router'
import {LearnDoService} from '../learn-do.service'
import {LearnItem, LearnItemId} from '../search-or-add-learnable-item/search-or-add-learnable-item.page'
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
  public item: LearnItem
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
    this.item = this.learnDoService.getItemById(this.id)
    this.doc = this.angularFirestore.collection<LearnItem>(`LearnItem`).doc(this.id)
    this.doc.valueChanges().subscribe(x => {
      console.log(`valueChanges`, JSON.stringify(x))
      this.title = x && x.title
      this.item = x
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
      header: 'Delete item ' + this.item.title + " ?",
      message: 'Delete <strong>'+ this.item.title +'</strong>!!!',
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

}
