import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore'
import {sidesDefs, sidesDefsArray} from '../core/sidesDefs'
import {LearnItem} from '../models/LearnItem'


@Component({
  selector: 'app-actionable-item',
  templateUrl: './actionable-item.component.html',
  styleUrls: ['./actionable-item.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionableItemComponent implements OnInit {

  sidesDefsArray = sidesDefsArray

  @Input() item: LearnItem
  // @Input() search: string

  constructor(
    protected angularFirestore: AngularFirestore,
  ) { }

  ngOnInit() {}

  playAudio() {
    this.angularFirestore.collection('LearnDoAudio').doc(this.item.id).get().subscribe(audioItem => {
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

  joinedSides() {
    // this seems very slow
    return sidesDefsArray.map(side => this.item[side.id]).filter(_ => _).join(' | ')
  }
}
