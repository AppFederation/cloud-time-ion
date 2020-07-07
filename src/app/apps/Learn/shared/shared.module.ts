import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SelfRatingComponent} from './self-rating/self-rating.component'
import {RatingsModule} from '../../../libs/AppFedSharedIonic/ratings/ratings.module'
import {PlayButtonComponent} from './play-button/play-button.component'
import {IonicModule} from '@ionic/angular'
import {SideLabelComponent} from '../side-label/side-label.component'

const exports = [
  SelfRatingComponent,
  PlayButtonComponent,
]

@NgModule({
  declarations: [
    ...exports,
    SideLabelComponent,
  ],
  imports: [
    CommonModule,
    RatingsModule,
    IonicModule,
  ],
  exports: [
    exports,
    SideLabelComponent,
  ],
})
export class SharedModule { }
