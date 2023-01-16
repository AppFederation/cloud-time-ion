import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriesPageRoutingModule } from './categories-routing.module';

import { CategoriesPage } from './categories.page';
import {CategoriesComponent} from '../../../shared/categories/categories.component'
import {CategoriesModule} from '../../../shared/categories/categories.module'
import {OdmModule} from '../../../libs/AppFedShared/odm/odm.module'
import {SharedModule} from '../../../shared/shared.module'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CategoriesPageRoutingModule,
        CategoriesModule,
        OdmModule,
        SharedModule,
    ],
  declarations: [CategoriesPage],
})
export class CategoriesPageModule {}
