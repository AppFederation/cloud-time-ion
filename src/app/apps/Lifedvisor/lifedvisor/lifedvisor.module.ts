import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LifedvisorPageRoutingModule } from './lifedvisor-routing.module';

import { LifedvisorPage } from './lifedvisor.page';
import {SharedModule} from '../../../shared/shared.module'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LifedvisorPageRoutingModule,
        SharedModule,
    ],
  declarations: [LifedvisorPage]
})
export class LifedvisorPageModule {}
