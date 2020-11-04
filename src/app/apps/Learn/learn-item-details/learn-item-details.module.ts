import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LearnItemDetailsPage } from './learn-item-details.page';
import {OdmModule} from '../../../libs/AppFedShared/odm/odm.module'
import {RatingsModule} from '../../../libs/AppFedSharedIonic/ratings/ratings.module'
import {LearnSharedModule} from '../shared/learn-shared.module'
import {EditorModule} from '@tinymce/tinymce-angular'
import {LearnItemDetailsHintsComponent} from './learn-item-details-hints/learn-item-details-hints.component'
import {TimeModule} from '../../../libs/AppFedShared/time/time.module'
import {ImportanceEditComponent} from './importance-edit/importance-edit.component'

const routes: Routes = [
  {
    path: ':itemId',
    component: LearnItemDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    OdmModule,
    RatingsModule,
    LearnSharedModule,
    EditorModule,
    TimeModule,
  ],
  declarations: [LearnItemDetailsPage, LearnItemDetailsHintsComponent, ImportanceEditComponent],
})
export class LearnItemDetailsPageModule {}
