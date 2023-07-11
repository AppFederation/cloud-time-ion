import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LifeOverviewsPage } from './life-overviews.page';

const routes: Routes = [
  {
    path: '',
    component: LifeOverviewsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LifeOverviewsPageRoutingModule {}
