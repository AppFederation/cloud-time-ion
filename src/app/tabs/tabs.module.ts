import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import {ShoppingListsPageModule} from "../ShopNext/shopping-lists-page/shopping-lists-page.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    ShoppingListsPageModule,
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
