import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import {ShoppingListsPageModule} from "../apps/ShopNext/shopping-lists-page/shopping-lists-page.module";
import {ShoppingListsPageComponent} from "../apps/ShopNext/shopping-lists-page/shopping-lists-page.component";
import {RecipesPageComponent} from "../apps/CookBook/recipes-page/recipes-page/recipes-page.component";

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
        // loadChildren: '../ShopNext/shopping-lists-page/shopping-lists-page.module#ShoppingListsPageModule' /* FIXME: call stack size exceeded */
      }
    ]
  },
  {
    path: 'recipes',
    children: [
      {
        path: '',
        component: RecipesPageComponent
        // loadChildren: '../apps/ShopNext/shopping-lists-page/shopping-lists-page.module#ShoppingListsPageModule'
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
    redirectTo: '/recipes',
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
