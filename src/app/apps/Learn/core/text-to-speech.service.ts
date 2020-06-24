import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {

  constructor() { }

  // const msg = new SpeechSynthesisUtterance();

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
