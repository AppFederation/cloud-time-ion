import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestVirtualScrollPage } from './test-virtual-scroll.page';

const routes: Routes = [
  {
    path: '',
    component: TestVirtualScrollPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestVirtualScrollPageRoutingModule {}
