import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RationalePageRoutingModule } from './rationale-routing.module';

import { RationalePage } from './rationale.page';
import {RationaleComponent} from './rationale/rationale.component';
import {FlowStateComponent} from '../life-overviews/flow-state/flow-state.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RationalePageRoutingModule
  ],
  exports: [
    FlowStateComponent
  ],
  declarations: [
    RationalePage,
    RationaleComponent,
    FlowStateComponent,
  ]
})
export class RationalePageModule {}
