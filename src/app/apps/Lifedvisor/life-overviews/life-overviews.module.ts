import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LifeOverviewsPageRoutingModule } from './life-overviews-routing.module';

import { LifeOverviewsPage } from './life-overviews.page';
import {RationalePageModule} from '../rationale/rationale.module';
import {IkigaiDiagramComponent} from './ikigai-diagram/ikigai-diagram.component';
import {GrowthDiagramComponent} from './growth-diagram/growth-diagram.component';
import {RadicalCandorComponent} from './radical-candor/radical-candor.component';
import {EnergyComponent} from './energy/energy.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LifeOverviewsPageRoutingModule,
    RationalePageModule
  ],
  exports: [
    GrowthDiagramComponent
  ],
  declarations: [
    LifeOverviewsPage,
    IkigaiDiagramComponent,
    GrowthDiagramComponent,
    RadicalCandorComponent,
    EnergyComponent,
  ]
})
export class LifeOverviewsPageModule {}
