import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {LearnItem, LearnItem$, LearnItemId} from '../../models/LearnItem'
import {AngularFirestore} from '@angular/fire/firestore'

@Component({
  selector: 'app-play-button',
  templateUrl: './play-button.component.html',
  styleUrls: ['./play-button.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush /* keep in mind when implementing more features */,
})
export class PlayButtonComponent implements OnInit {

  @Input()
  item: LearnItem

  @Input()
  private itemId: LearnItemId

  constructor(
    protected angularFirestore: AngularFirestore,
  ) { }

  ngOnInit() {}

  playAudio() {
    // TODO: move to service
    this.angularFirestore.collection('LearnDoAudio').doc(this.itemId || this.item.id).get().subscribe(audioItem => {
      const audioBytes = audioItem.data().audio.toUint8Array().buffer as ArrayBuffer
      const audioCtx = new ((window as any).AudioContext || (window as any).webkitAudioContext)()
      const source = audioCtx.createBufferSource();

      audioCtx.decodeAudioData(audioBytes, function(buffer) {
          source.buffer = buffer;
          console.log(`source.buffer`, source.buffer)

          source.connect(audioCtx.destination);
          // source.loop = true;
          source.start(0)
        },

        function(e){
          window.alert("Error with decoding audio data: " + e.err + ' ' + e);
        }
      );

      console.log(`audioItem.audio`, audioBytes)
    })
  }

}
