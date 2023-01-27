import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WhatNextPageRoutingModule } from './what-next-routing.module';

import { WhatNextPage } from './what-next.page';
import {LearnSharedModule} from '../shared/learn-shared.module'
import {SharedModule} from '../../../shared/shared.module'
import {EnergyGraphComponent} from '../energy-graph/energy-graph.component'
import {OdmModule} from '../../../libs/AppFedShared/odm/odm.module'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WhatNextPageRoutingModule,
        LearnSharedModule,
        SharedModule,
        OdmModule,
    ],
    declarations: [WhatNextPage, EnergyGraphComponent],
})
export class WhatNextPageModule {}
