import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriesPageRoutingModule } from './categories-routing.module';

import { CategoriesPage } from './categories.page';
import {CategoriesComponent} from '../../../shared/categories/categories.component'
import {CategoriesModule} from '../../../shared/categories/categories.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesPageRoutingModule,
    CategoriesModule,
  ],
  declarations: [CategoriesPage],
})
export class CategoriesPageModule {}
