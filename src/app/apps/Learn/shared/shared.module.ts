import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SelfRatingComponent} from './self-rating/self-rating.component'
import {RatingsModule} from '../../../libs/AppFedSharedIonic/ratings/ratings.module'
import {PlayButtonComponent} from './play-button/play-button.component'
import {IonicModule} from '@ionic/angular'

const exports = [
  SelfRatingComponent,
  PlayButtonComponent,
]

@NgModule({
  declarations: [
    ...exports,
  ],
  imports: [
    CommonModule,
    RatingsModule,
    IonicModule,
  ],
  exports: exports
})
export class SharedModule { }
