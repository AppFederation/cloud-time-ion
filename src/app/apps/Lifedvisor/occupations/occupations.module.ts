import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OccupationsPageRoutingModule } from './occupations-routing.module';

import { OccupationsPage } from './occupations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OccupationsPageRoutingModule
  ],
  declarations: [OccupationsPage]
})
export class OccupationsPageModule {}
