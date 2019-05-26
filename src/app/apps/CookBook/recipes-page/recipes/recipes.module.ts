import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RecipeItemComponent} from "./recipe-item/recipe-item.component";
import {IonicModule} from "@ionic/angular";

const exports = [
  RecipeItemComponent,
]

@NgModule({
  declarations: [
    ...exports
    ],
  exports: exports,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class RecipesModule { }
