import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemProcessingPage } from './item-processing.page';

const routes: Routes = [
  {
    path: '',
    component: ItemProcessingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemProcessingPageRoutingModule {}
