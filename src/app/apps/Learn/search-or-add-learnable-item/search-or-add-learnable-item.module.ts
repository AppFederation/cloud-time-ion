import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SearchOrAddLearnableItemPage } from './search-or-add-learnable-item.page';
import {OdmModule} from '../../../libs/AppFedShared/odm/odm.module'
import {ActionableItemComponent} from '../actionable-item/actionable-item.component'

const routes: Routes = [
  {
    path: '',
    component: SearchOrAddLearnableItemPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    OdmModule,
  ],
  declarations: [SearchOrAddLearnableItemPage, ActionableItemComponent],
})
export class SearchOrAddLearnableItemPageModule {}
