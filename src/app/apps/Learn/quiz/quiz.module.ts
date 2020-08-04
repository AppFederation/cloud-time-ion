import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {QuizPage} from './quiz.page';
import {OdmModule} from '../../../libs/AppFedShared/odm/odm.module'
import {RatingsModule} from '../../../libs/AppFedSharedIonic/ratings/ratings.module'
import {SharedModule} from '../shared/shared.module'
import {TimeModule} from '../../../libs/AppFedShared/time/time.module'
import {EditorModule} from '@tinymce/tinymce-angular'
import {QuizItemDetailsComponent} from './quiz-item-details/quiz-item-details.component'

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
    SharedModule,
    TimeModule,
    EditorModule,
  ],
  declarations: [
    QuizPage,
    QuizItemDetailsComponent,
  ],
})
export class QuizPageModule {
}
