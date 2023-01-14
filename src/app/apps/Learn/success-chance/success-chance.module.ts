import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuccessChancePageRoutingModule } from './success-chance-routing.module';

import { SuccessChancePage } from './success-chance.page';
import {SharedModule} from '../../../shared/shared.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuccessChancePageRoutingModule,
    SharedModule,
  ],
  declarations: [SuccessChancePage]
})
export class SuccessChancePageModule {}
