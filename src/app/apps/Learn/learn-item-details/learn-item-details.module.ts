import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LearnItemDetailsPage } from './learn-item-details.page';
import {OdmModule} from '../../../libs/AppFedShared/odm/odm.module'
import {RatingsModule} from '../../../libs/AppFedSharedIonic/ratings/ratings.module'
import {SharedModule} from '../shared/shared.module'

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
    SharedModule,
  ],
  declarations: [LearnItemDetailsPage]
})
export class LearnItemDetailsPageModule {}
