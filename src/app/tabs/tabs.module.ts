import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import {ShoppingListsPageModule} from "../apps/ShopNext/shopping-lists-page/shopping-lists-page.module";
import {RecipesPageModule} from "../apps/CookBook/recipes-page/recipes-page.module";
import {ShoppingListDetailsPageComponent} from "../apps/ShopNext/shopping-list-details-page/shopping-list-details-page.component";
import {ShoppingListDetailsPageModule} from "../apps/ShopNext/shopping-list-details-page/shopping-list-details-page.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    ShoppingListsPageModule,
    ShoppingListDetailsPageModule,
    RecipesPageModule,
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
