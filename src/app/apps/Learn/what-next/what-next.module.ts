import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WhatNextPageRoutingModule } from './what-next-routing.module';

import { WhatNextPage } from './what-next.page';
import {LearnSharedModule} from '../shared/learn-shared.module'
import {SharedModule} from '../../../shared/shared.module'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WhatNextPageRoutingModule,
        LearnSharedModule,
        SharedModule,
    ],
  declarations: [WhatNextPage]
})
export class WhatNextPageModule {}
