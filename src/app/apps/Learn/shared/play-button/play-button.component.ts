import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {LearnItem, LearnItemId} from '../../models/LearnItem'
import {AngularFirestore} from '@angular/fire/firestore'
import {LearnItem$} from '../../models/LearnItem$'

@Component({
  selector: 'app-play-button',
  templateUrl: './play-button.component.html',
  styleUrls: ['./play-button.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush /* keep in mind when implementing more features */,
})
export class PlayButtonComponent implements OnInit {

  @Input()
  item ? : any // LearnItem | null

  @Input()
  private itemId ? : LearnItemId

  isPlaying = false
  private source ? : AudioBufferSourceNode

  constructor(
    protected angularFirestore: AngularFirestore,
    protected changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {}


  playOrStopAudio() {
    if ( this.isPlaying ) {
      this.stopPlaying()
      return
      // (will be pause ; and long-press to stop)
    }
    this.isPlaying = true
    // TODO: move to service
    this.angularFirestore.collection('LearnDoAudio').doc(this.itemId || this.item?.id).get().subscribe(audioItem => {
      const data = audioItem ?. data() as any // this started to be unknown after angularfire upgrade
      const audioBytes = data ?. audio?.toUint8Array()?.buffer as ArrayBuffer
      // todo maybe reuse ctx / source
      const audioCtx = new ((window as any).AudioContext || (window as any).webkitAudioContext)()
      const source = audioCtx.createBufferSource()
      this.source = source

      audioCtx.decodeAudioData(audioBytes,
        (buffer: AudioBuffer) => {
          source.buffer = buffer;
          console.log(`source.buffer`, source.buffer)

          source.connect(audioCtx.destination);
          // source.loop = true;
          source.onended = () => this.onSoundEnded()
          source.start(0)
        },

        (e: DOMException) => {
          window.alert("Error with decoding audio data: " + (e as any).err + ' ' + e);
        }
      );

      console.log(`audioItem.audio`, audioBytes)
    })
  }

  private onSoundEnded() {
    this.isPlaying = false
    this.changeDetectorRef.detectChanges()
  }

  stopPlaying() {
    this.isPlaying = false
    this.source ?. stop()
    this.changeDetectorRef.detectChanges()
  }
}
