import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ShoppingListDetailsPageComponent} from "./shopping-list-details-page.component";
import {OdmUiModule} from "../../../libs/AppFedSharedIonic/odm-ui/odm-ui.module";

@NgModule({
  declarations: [
    ShoppingListDetailsPageComponent,
  ],
  imports: [
    CommonModule,
    OdmUiModule,
  ]
})
export class ShoppingListDetailsPageModule { }
