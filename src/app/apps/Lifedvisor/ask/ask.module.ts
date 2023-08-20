import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AskPageRoutingModule } from './ask-routing.module';

import { AskPage } from './ask.page';
import {HintComponent} from './hint/hint.component';
import {SharedModule} from '../../../shared/shared.module'
import {OdmModule} from '../../../libs/AppFedShared/odm/odm.module'
import {HintEmbedMediaComponent} from './hint/hint-embed-media/hint-embed-media.component'
import {LifeOverviewsPageModule} from '../life-overviews/life-overviews.module'
import {RationalePageModule} from '../rationale/rationale.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AskPageRoutingModule,
    SharedModule,
    OdmModule,
    LifeOverviewsPageModule,
    RationalePageModule,
  ],
  declarations: [
    AskPage,
    HintComponent,
    HintEmbedMediaComponent,
  ],
})
export class AskPageModule {}
