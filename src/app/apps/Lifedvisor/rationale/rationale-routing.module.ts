import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RationalePage } from './rationale.page';

const routes: Routes = [
  {
    path: '',
    component: RationalePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RationalePageRoutingModule {}
