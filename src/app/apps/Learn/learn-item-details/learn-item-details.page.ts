import { Component, OnInit } from '@angular/core';
import {sidesDefsArray} from '../sidesDefs'
import {ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-learn-item-details',
  templateUrl: './learn-item-details.page.html',
  styleUrls: ['./learn-item-details.page.sass'],
})
export class LearnItemDetailsPage implements OnInit {

  window = window
  sidesDefsArray = sidesDefsArray

  constructor(
    public activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    const msg = new SpeechSynthesisUtterance();

    // Set the text.
    msg.text = this.activatedRoute.snapshot.params['itemId'];

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
    window.speechSynthesis.speak(msg, );
  }

}
