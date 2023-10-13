import { Component, OnInit } from '@angular/core';
import {UploadService} from '../../core/upload.service'
import {LearnItemItemsService} from '../../core/learn-item-items.service'
import {OdmBackend} from '../../../../libs/AppFedShared/odm/OdmBackend'
import {LearnItem} from '../../models/LearnItem'

declare const MediaRecorder: any;

@Component({
  selector: 'app-mic',
  templateUrl: './mic.component.html',
  styleUrls: ['./mic.component.sass'],
})
export class MicComponent implements OnInit {

  isRecording = false
  private mediaRecorder: any = null
  private audioChunks: any[] = []

  /* TODO: move to service, to ensure reference is not lost on component being re-created (e.g. on mobile) */
  stream: MediaStream | undefined

  constructor(
    public uploadService: UploadService,
    public learnDoService: LearnItemItemsService,
  ) { }

  ngOnInit() {}

  onMicClick(event ? : any) {
    if (event) {
      event.preventDefault() // prevent mouse click emulation from touchstart event because we have on-click as well
    }
    // TODO: move to AudioRecordService:
    if ( this.isRecording ) {
      this.stopRecordingIfNeeded()
    } else {
      this.startRecording()
    }
  }

  public stopRecordingIfNeeded() {
    if ( this.isRecording ) {
      this.mediaRecorder.stop()
      this.isRecording = false
    }
  }

  private startRecording() {
    if ( this.stream ) {
      this.recordUsingStream(this.stream)
    } else {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        // http://mdn.github.io/web-dictaphone/
        // https://github.com/mdn/web-dictaphone/
        console.log('getUserMedia supported.');
        navigator.mediaDevices.getUserMedia(
          {
            audio: true, // constraints - only audio needed for this app
          })
          .then((stream) => {
            this.stream = stream
            this.recordUsingStream(stream)
          })
          .catch(function (err) {
              window.alert('The following getUserMedia error occurred: ' + err);
              /* for iOS: https://www.gmass.co/blog/record-audio-mobile-web-page-ios-android/ -- AudioContext: audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                https://developers.google.com/web/fundamentals/media/recording-audio
               */
            },
          );
      } else {
        window.alert('getUserMedia not supported on your browser!');
      }
    }
  }

  private recordUsingStream(stream: MediaStream) {
    this.isRecording = true
    this.mediaRecorder = new MediaRecorder(stream); // not sure if this is needed again after stopping previous
    this.mediaRecorder.start();
    console.log(`MediaRecorder started: this.mediaRecorder.state`, this.mediaRecorder.state);

    this.audioChunks = [];

    this.mediaRecorder.ondataavailable = (e: any) => {
      this.audioChunks.push(e.data);
    }
    this.mediaRecorder.onstop = (e: any) => {
      this.onRecordStopped()
    }
  }

  private onRecordStopped() {
    console.log("stopping recording");
    const blob = new Blob(this.audioChunks, { 'type' : 'audio/ogg; codecs=opus' });
    this.audioChunks = [];
    const audioURL = window.URL.createObjectURL(blob);
    console.log(`audioURL`, audioURL)
    console.log(`learnDoService`, this.learnDoService)

    const learnItemData = new LearnItem()
    learnItemData.hasAudio = true
    learnItemData.whenAdded = OdmBackend.nowTimestamp()
    const learnItem$ = this.learnDoService.newItem(undefined, learnItemData)
    learnItem$.saveNowToDb()
    this.uploadService.uploadAudio2(blob, learnItem$.id !)
  }

  stopRecordingIfNeededAndReleaseMic() {
    this.stopRecordingIfNeeded()
    setTimeout(() => {
      // this.stream.stop() // https://developers.google.com/web/updates/2015/07/mediastream-deprecations?hl=en#stop-ended-and-active
      // https://stackoverflow.com/questions/35977831/removing-the-recording-icon-mediastreamrecorder-js-library
      // https://stackoverflow.com/questions/11642926/stop-close-webcam-which-is-opened-by-navigator-getusermedia
      this.stream ?. getTracks().forEach(function(track) {
        track.stop();
      });
      this.stream = undefined
    }, 300 /* just some instinctual defensive voodoo programming ;) but harmless */)
  }
}
