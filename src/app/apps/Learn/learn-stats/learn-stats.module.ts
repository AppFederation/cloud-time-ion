import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LearnStatsPageRoutingModule } from './learn-stats-routing.module';

import { LearnStatsPage } from './learn-stats.page';
import {SharedModule} from '../shared/shared.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LearnStatsPageRoutingModule
  ],
  declarations: [LearnStatsPage]
})
export class LearnStatsPageModule {}
