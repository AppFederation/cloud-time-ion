import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AudioVisualizerComponent} from './audio-visualizer/audio-visualizer.component'

@NgModule({
  declarations: [
    AudioVisualizerComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AudioVisualizerComponent,
  ]
})
export class AudioModule { }
