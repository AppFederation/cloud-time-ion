import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {QuizPage} from './quiz.page';
import {OdmModule} from '../../../libs/AppFedShared/odm/odm.module'
import {RatingsModule} from '../../../libs/AppFedSharedIonic/ratings/ratings.module'
import {LearnSharedModule} from '../shared/learn-shared.module'
import {TimeModule} from '../../../libs/AppFedShared/time/time.module'
import {EditorModule} from '@tinymce/tinymce-angular'
import {QuizItemDetailsComponent} from './quiz-item-details/quiz-item-details.component'
import {QuizTipsComponent} from './quiz-tips/quiz-tips.component'
import {QuizOptionsComponent} from './quiz-options/quiz-options.component'
import {TimersPageModule} from '../../../timers/timers.module'
import {ShowAnswerAndRateComponent} from './show-answer-and-rate/show-answer-and-rate.component'
import {CongratsQuizFinishedComponent} from './quiz-finished/congrats-quiz-finished/congrats-quiz-finished.component'
import {QuizFinishedComponent} from './quiz-finished/quiz-finished.component'
import {QuizItemsLeftComponent} from './quiz-items-left/quiz-items-left.component'
import {QuizIntervalsComponent} from './quiz-options/quiz-intervals/quiz-intervals.component'

const routes: Routes = [
  {
    path: '',
    component: QuizPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    OdmModule,
    RatingsModule,
    LearnSharedModule,
    TimeModule,
    EditorModule,
    TimeModule,
  ],
    declarations: [
        QuizPage,
        QuizItemDetailsComponent,
        QuizTipsComponent,
        QuizOptionsComponent,
        ShowAnswerAndRateComponent,
        CongratsQuizFinishedComponent,
        QuizFinishedComponent,
        QuizItemsLeftComponent,
        QuizIntervalsComponent,
    ],
})
export class QuizPageModule {
}
