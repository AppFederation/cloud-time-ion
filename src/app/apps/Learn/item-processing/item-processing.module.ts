import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemProcessingPageRoutingModule } from './item-processing-routing.module';

import { ItemProcessingPage } from './item-processing.page';
import {SharedModule} from '../../../shared/shared.module'
import {LearnSharedModule} from '../shared/learn-shared.module'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ItemProcessingPageRoutingModule,
        SharedModule,
        LearnSharedModule,
    ],
  declarations: [ItemProcessingPage]
})
export class ItemProcessingPageModule {}
