import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ShoppingListsPageComponent} from "./shopping-lists-page.component";
import {OdmFirestoreModule} from "../../libs/AppFedSharedFirebase/odm-firestore/odm-firestore.module";
import {IonicModule} from "@ionic/angular";
import {ShoppingListsModule} from "../shopping-lists/shopping-lists.module";
import {OdmUiModule} from "../../libs/AppFedSharedIonic/odm-ui/odm-ui.module";
import {OdmModule} from "../../libs/AppFedShared/odm/odm.module";

@NgModule({
  declarations: [
    ShoppingListsPageComponent,
  ],
  imports: [
    CommonModule,
    OdmModule,
    IonicModule.forRoot(),
    ShoppingListsModule,
    // OdmUiModule,
  ]
})
export class ShoppingListsPageModule { }
