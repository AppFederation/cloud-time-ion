import { Injectable } from '@angular/core';
import {AudioModule} from "./audio.module";

@Injectable({
  providedIn: AudioModule
})
export class AudioService {

  constructor() { }

  playAudio(file: string) {
    var audio = new Audio(file);
    // audio.loop = true
    // IDEA: gradually increase volume, so as not to bother other people in the vicinity
    // IDEA: exponential back-off
    audio.play().then(() => {
    });
  }
}
