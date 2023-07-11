import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AskPageRoutingModule } from './ask-routing.module';

import { AskPage } from './ask.page';
import {HintComponent} from './hint/hint.component';
import {SharedModule} from '../../../shared/shared.module'
import {OdmModule} from '../../../libs/AppFedShared/odm/odm.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AskPageRoutingModule,
    SharedModule,
    OdmModule,
  ],
  declarations: [
    AskPage,
    HintComponent,
  ]
})
export class AskPageModule {}
