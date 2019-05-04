import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { Tab2Page } from './tab2.page';
import {TimerItemComponent} from "./timer-item/timer-item.component";
import {TimersListComponent} from "./timers-list/timers-list.component";
import {TimeViewComponent} from "./time-view/time-view.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MomentModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }])
  ],
  declarations: [
      Tab2Page, TimePickerComponent, TimerItemComponent, TimersListComponent, TimeViewComponent
  ],
  entryComponents: [
    TimePickerComponent,
  ]
})
export class Tab2PageModule {}
