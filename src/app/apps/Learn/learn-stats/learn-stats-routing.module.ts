import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LearnStatsPage } from './learn-stats.page';

const routes: Routes = [
  {
    path: '',
    component: LearnStatsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LearnStatsPageRoutingModule {}
