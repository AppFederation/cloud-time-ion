import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tab1',
    children: [
      {
        path: '',
        loadChildren: '../tab1/tab1.module#Tab1PageModule'
      }
    ]
  },
  {
    path: 'timers',
    children: [
      {
        path: '',
        loadChildren: '../timers/timers.module#TimersPageModule'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/timers',
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
