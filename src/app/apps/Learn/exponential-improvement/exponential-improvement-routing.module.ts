import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExponentialImprovementPage } from './exponential-improvement.page';

const routes: Routes = [
  {
    path: '',
    component: ExponentialImprovementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExponentialImprovementPageRoutingModule {}
