import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { TimersPageComponent } from './timers-page.component';
import {TimerItemComponent} from "./timer-item/timer-item.component";
import {TimersListComponent} from "./timers-list/timers-list.component";
import {TimeViewComponent} from "./time-view/time-view.component";
import {TimerEndedComponent} from "./timer-ended/timer-ended.component";
import {TimerDetailsComponent} from "./timer-details/timer-details.component";
import {NumberPickerComponent} from "./number-picker/number-picker.component";
import {TimeLeftViewComponent} from "./time-left-view/time-left-view.component";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MomentModule,
    RouterModule.forChild([{ path: '', component: TimersPageComponent }]),
    SharedModule,
  ],
  declarations: [
    TimersPageComponent, TimePickerComponent, TimerItemComponent, TimersListComponent, TimeViewComponent, TimerEndedComponent,
    TimerDetailsComponent, NumberPickerComponent, TimeLeftViewComponent
  ],
  entryComponents: [
    TimerDetailsComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class Tab2PageModule {}
