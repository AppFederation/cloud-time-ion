import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SelfRatingComponent} from './self-rating/self-rating.component'
import {RatingsModule} from '../../../libs/AppFedSharedIonic/ratings/ratings.module'
import {PlayButtonComponent} from './play-button/play-button.component'
import {IonicModule} from '@ionic/angular'
import {SideLabelComponent} from './side-label/side-label.component'
import {ItemSideComponent} from './item-side/item-side.component'
import {ItemSidesComponent} from './item-sides/item-sides.component'
import {EditorModule} from '@tinymce/tinymce-angular'
import {ReactiveFormsModule} from '@angular/forms'
import {ToggleComponent} from './toggle/toggle.component'
import {QuizButtonComponent} from './quiz-button/quiz-button.component'
import {RouterModule} from '@angular/router'

const exports = [
  SelfRatingComponent,
  PlayButtonComponent,
  SideLabelComponent,
  ItemSideComponent,
  ItemSidesComponent,
  ToggleComponent,
  QuizButtonComponent,
]

@NgModule({
  declarations: [
    ...exports,
  ],
  imports: [
    CommonModule,
    RatingsModule,
    IonicModule,
    EditorModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    exports,
  ],
})
export class SharedModule { }
