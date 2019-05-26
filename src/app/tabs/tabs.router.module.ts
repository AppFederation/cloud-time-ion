import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import {ShoppingListsPageModule} from "../ShopNext/shopping-lists-page/shopping-lists-page.module";
import {ShoppingListsPageComponent} from "../ShopNext/shopping-lists-page/shopping-lists-page.component";

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
    path: 'shopping',
    children: [
      {
        path: '',
        component: ShoppingListsPageComponent
        // loadChildren: '../ShopNext/shopping-lists-page/shopping-lists-page.module#ShoppingListsPageModule'
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
    redirectTo: '/shopping',
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
