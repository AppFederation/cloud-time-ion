import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SelfRatingComponent} from './self-rating/self-rating.component'
import {RatingsModule} from '../../../libs/AppFedSharedIonic/ratings/ratings.module'
import {PlayButtonComponent} from './play-button/play-button.component'
import {IonicModule} from '@ionic/angular'
import {SideLabelComponent} from '../side-label/side-label.component'
import {ItemSideComponent} from './item-side/item-side.component'
import {EditorModule} from '@tinymce/tinymce-angular'
import {ReactiveFormsModule} from '@angular/forms'

const exports = [
  SelfRatingComponent,
  PlayButtonComponent,
]

@NgModule({
  declarations: [
    ...exports,
    SideLabelComponent,
    ItemSideComponent,
  ],
  imports: [
    CommonModule,
    RatingsModule,
    IonicModule,
    EditorModule,
    ReactiveFormsModule,
  ],
  exports: [
    exports,
    SideLabelComponent,
    ItemSideComponent,
  ],
})
export class SharedModule { }
