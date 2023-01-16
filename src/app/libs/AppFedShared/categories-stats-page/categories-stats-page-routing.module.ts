import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriesStatsPagePage } from './categories-stats-page.page';

const routes: Routes = [
  {
    path: '',
    component: CategoriesStatsPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesStatsPagePageRoutingModule {}
