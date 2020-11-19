import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SelfRatingComponent} from './self-rating/self-rating.component'
import {RatingsModule} from '../../../libs/AppFedSharedIonic/ratings/ratings.module'
import {PlayButtonComponent} from './play-button/play-button.component'
import {IonicModule} from '@ionic/angular'
import {SideLabelComponent} from './side-label/side-label.component'
import {ItemSideComponent} from './item-side/item-side.component'
import {EditorModule} from '@tinymce/tinymce-angular'
import {ReactiveFormsModule} from '@angular/forms'
import {ToggleComponent} from './toggle/toggle.component'
import {QuizButtonComponent} from './quiz-button/quiz-button.component'
import {RouterModule} from '@angular/router'
import {ProcessButtonComponent} from './process-button/process-button.component'
import {StackedInteractiveChartComponent} from './stacked-interactive-chart/stacked-interactive-chart.component'
import {SideIconComponent} from './side-icon/side-icon.component'
import {SharedModule} from '../../../shared/shared.module'

const exports = [
  SelfRatingComponent,
  PlayButtonComponent,
  SideLabelComponent,
  ItemSideComponent,
  ToggleComponent,
  QuizButtonComponent,
  StackedInteractiveChartComponent,
]

@NgModule({
    declarations: [
        ...exports,
        ProcessButtonComponent,
        SideIconComponent,
    ],
  imports: [
    CommonModule,
    RatingsModule,
    IonicModule,
    EditorModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
  ],
  exports: [
    exports,
    ProcessButtonComponent,
  ],
})
export class LearnSharedModule { }
