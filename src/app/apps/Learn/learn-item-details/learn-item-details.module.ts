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
import {FunLevelEditComponent} from './fun-level-edit/fun-level-edit.component'
import {MentalEffortLevelEditComponent} from './mental-effort-level-edit/mental-effort-level-edit.component'
import {ItemClassEditComponent} from './item-class-edit/item-class-edit.component'
import {StatusesEditComponent} from './statuses-edit/statuses-edit.component'
import {SharedModule} from '../../../shared/shared.module'

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
    SharedModule,
  ],
  declarations: [
    LearnItemDetailsPage,
    LearnItemDetailsHintsComponent,
    ImportanceEditComponent,
    FunLevelEditComponent,
    MentalEffortLevelEditComponent,
    MentalEffortLevelEditComponent,
    ItemClassEditComponent,
    StatusesEditComponent,
  ],
})
export class LearnItemDetailsPageModule {}
