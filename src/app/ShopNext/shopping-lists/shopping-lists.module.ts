import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {OdmUiModule} from "../../AppFedSharedIonic/odm-ui/odm-ui.module";
import {ShoppingListsListComponent} from "./shopping-lists-list/shopping-lists-list.component";
import {ShoppingListsService} from "./shopping-lists.service";

const exports = [
  ShoppingListsListComponent,
]

@NgModule({
  providers: [
    ShoppingListsService,
  ],
  declarations: [
    ...exports
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    OdmUiModule,
  ],
  exports: exports
})
export class ShoppingListsModule { }
