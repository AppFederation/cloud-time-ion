import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Required} from '../../utils/angular/Required.decorator'

// https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createAnalyser
// ->
// https://github.com/mdn/voice-change-o-matic/blob/gh-pages/scripts/app.js#L128-L205
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
// https://github.com/cwilso/volume-meter/
// https://webaudiodemos.appspot.com/
// https://github.com/wayou/HTML5_Audio_Visualizer


const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

@Component({
  selector: 'app-audio-visualizer',
  templateUrl: './audio-visualizer.component.html',
  styleUrls: ['./audio-visualizer.component.sass'],
})
export class AudioVisualizerComponent implements OnInit, OnDestroy {

  analyser = audioCtx.createAnalyser()

  @Required()
  @Input() stream ! : MediaStream | undefined
  private source ! : MediaStreamAudioSourceNode

  bufferLength = 32;

  private dataArray: Uint8Array = new Uint8Array(this.bufferLength);
  private array ! : Array<number>

  constructor(
  ) { }


  private intervalHandle ?: number

  ngOnInit() {
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;
    this.analyser.smoothingTimeConstant = 0.85;

    this.source = audioCtx.createMediaStreamSource(this.stream !)
    this.source.connect(this.analyser)
    this.analyser.fftSize = this.bufferLength;
    this.intervalHandle = setInterval(() => {
      // this.analyser.getByteTimeDomainData(this.dataArray);
      this.analyser.getByteFrequencyData(this.dataArray) // maybe freq domain more useful coz it kinda shows noise and voice in different place
      // console.log(`vis`, this.dataArray)
      this.array = Array.from(this.dataArray)
    }, 50)

  }

  ngOnDestroy() {
    clearInterval(this.intervalHandle)
  }

}
