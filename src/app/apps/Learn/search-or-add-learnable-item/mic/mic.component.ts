import { Component, OnInit } from '@angular/core';
declare const MediaRecorder: any;

@Component({
  selector: 'app-mic',
  templateUrl: './mic.component.html',
  styleUrls: ['./mic.component.sass'],
})
export class MicComponent implements OnInit {

  isRecording = false
  private mediaRecorder: any = null
  private chunks: any[] = []

  constructor() { }

  ngOnInit() {}

  onMicClick() {
    if ( this.isRecording ) {
      this.mediaRecorder.stop()
      this.isRecording = false
      return;
    }
    this.startRecording()
  }

  private startRecording() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia supported.');

      navigator.mediaDevices.getUserMedia(
        // constraints - only audio needed for this app
        {
          audio: true,
        })
        .then((stream) => {
          this.isRecording = true
          // Success callback
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.start();
          console.log(this.mediaRecorder.state);
          console.log("recorder started");

          this.chunks = [];

          this.mediaRecorder.ondataavailable = (e) => {
            this.chunks.push(e.data);
          }
          this.mediaRecorder.onstop = (e) => {
            this.onRecordStopped()
          }

        })
        .catch(function (err) {
            console.log('The following getUserMedia error occurred: ' + err);
          },
        );
    } else {
      console.log('getUserMedia not supported on your browser!');
    }
  }

  private onRecordStopped() {
    console.log("recorder stopped");
    const blob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
    this.chunks = [];
    const audioURL = window.URL.createObjectURL(blob);
    console.log(`audioURL`, audioURL)
    // audio.src = audioURL;

    // deleteButton.onclick = function(e) {
    //   let evtTgt = e.target;
    //   evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
    // }
  }
}
