import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExponentialImprovementPageRoutingModule } from './exponential-improvement-routing.module';

import { ExponentialImprovementPage } from './exponential-improvement.page';
import {SharedModule} from '../../../shared/shared.module'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ExponentialImprovementPageRoutingModule,
        SharedModule,
    ],
  declarations: [ExponentialImprovementPage]
})
export class ExponentialImprovementPageModule {}
