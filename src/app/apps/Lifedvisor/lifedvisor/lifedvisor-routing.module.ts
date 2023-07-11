import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LifedvisorPage } from './lifedvisor.page';

const routes: Routes = [
  {
    path: '',
    component: LifedvisorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LifedvisorPageRoutingModule {}
