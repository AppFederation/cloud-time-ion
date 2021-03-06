import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MindfulnessPage } from './mindfulness.page';

const routes: Routes = [
  {
    path: '',
    component: MindfulnessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MindfulnessPageRoutingModule {}
