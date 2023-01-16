import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriesStatsPagePageRoutingModule } from './categories-stats-page-routing.module';

import { CategoriesStatsPagePage } from './categories-stats-page.page';
import {SharedModule} from '../../../shared/shared.module'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CategoriesStatsPagePageRoutingModule,
        SharedModule,
    ],
  declarations: [CategoriesStatsPagePage]
})
export class CategoriesStatsPagePageModule {}
