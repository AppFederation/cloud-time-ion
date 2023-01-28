import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LearnStatsPageRoutingModule } from './learn-stats-routing.module';

// import { LearnStatsPage } from './learn-stats.page';
import {LearnSharedModule} from '../shared/learn-shared.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LearnSharedModule,
    LearnStatsPageRoutingModule
  ],
  // declarations: [LearnStatsPage]
})
export class LearnStatsPageModule {}
