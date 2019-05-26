import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RecipesPageComponent} from "./recipes-page/recipes-page.component";
import {OdmUiModule} from "../../../libs/AppFedSharedIonic/odm-ui/odm-ui.module";
import {RecipesModule} from "./recipes/recipes.module";
import {IonicModule} from "@ionic/angular";

@NgModule({
  declarations: [
    RecipesPageComponent,
  ],
  imports: [
    CommonModule,
    OdmUiModule,
    RecipesModule,
    IonicModule.forRoot()
  ]
})
export class RecipesPageModule { }
