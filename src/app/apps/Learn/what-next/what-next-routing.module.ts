import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WhatNextPage } from './what-next.page';

const routes: Routes = [
  {
    path: '',
    component: WhatNextPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhatNextPageRoutingModule {}
