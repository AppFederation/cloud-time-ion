import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OccupationsPage } from './occupations.page';

const routes: Routes = [
  {
    path: '',
    component: OccupationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OccupationsPageRoutingModule {}
