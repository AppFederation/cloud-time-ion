import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestVirtualScrollPageRoutingModule } from './test-virtual-scroll-routing.module';

import { TestVirtualScrollPage } from './test-virtual-scroll.page';
import {TestItemComponent} from './test-item/test-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestVirtualScrollPageRoutingModule
  ],
  declarations: [TestVirtualScrollPage, TestItemComponent]
})
export class TestVirtualScrollPageModule {}
