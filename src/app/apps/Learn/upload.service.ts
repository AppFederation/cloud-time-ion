import { Injectable } from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage'
import {uuid4} from '@capacitor/core/dist/esm/util'
import {SyncStatusService} from '../../libs/AppFedShared/odm/sync-status.service'
import {AngularFirestore} from '@angular/fire/firestore'

import * as firebase from 'firebase';

// import 'firebase/firestore'

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    protected angularFireStorage: AngularFireStorage,
    protected angularFirestore: AngularFirestore,
    protected syncStatusService: SyncStatusService,
  ) {
  }

  uploadAudio(blob: Blob) {
    console.log(`blob.size`, blob.size)
    // Create a root reference
    const storageRef = this.angularFireStorage.ref('audio');

    const uploadTask = storageRef.child(uuid4() + '.ogg').put(blob)
    this.syncStatusService.handleSavingPromise(uploadTask)
    // const audioRef = storageRef.child('audio_' + uuid4());
    // audioRef.uplo

    // var audioRef = storageRef.child('images/mountains.jpg');

// While the file names are the same, the references point to different files
//     mountainsRef.name === mountainImagesRef.name            // true
//     mountainsRef.fullPath === mountainImagesRef.fullPath    // false


  }

  async uploadAudio2(blob: Blob/*, id: any*/, id: string) {
    console.log(`blob.size`, blob.size)

    // blob.getBytes
    const int8Array = new Uint8Array(await (blob as any).arrayBuffer())
    console.log(`int8Array.byteLength`, int8Array.byteLength)
    const promise = this.angularFirestore.collection('LearnDoAudio').doc(id).set({
      audio: firebase.firestore.Blob.fromUint8Array(int8Array),
    })
    this.syncStatusService.handleSavingPromise(promise)
  }
}
