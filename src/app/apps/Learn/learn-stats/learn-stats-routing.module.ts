import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { LearnStatsPage } from './learn-stats.page';
import {HttpClientModule} from '@angular/common/http'

const routes: Routes = [
  // {
  //   path: '',
  //   component: LearnStatsPage
  // }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    HttpClientModule,
  ],
  exports: [RouterModule],
})
export class LearnStatsPageRoutingModule {}
