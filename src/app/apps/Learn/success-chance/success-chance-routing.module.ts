import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuccessChancePage } from './success-chance.page';

const routes: Routes = [
  {
    path: '',
    component: SuccessChancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuccessChancePageRoutingModule {}
