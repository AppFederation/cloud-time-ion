import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MindfulnessPageRoutingModule } from './mindfulness-routing.module';

import { MindfulnessPage } from './mindfulness.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MindfulnessPageRoutingModule
  ],
  declarations: [MindfulnessPage]
})
export class MindfulnessPageModule {}
