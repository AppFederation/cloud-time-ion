import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MomentModule} from 'ngx-moment';
import {TimePickerComponent} from '../AppFedSharedIonic/time/time-picker/time-picker.component';
import {TimersPageComponent} from './timers-page.component';
import {TimerItemComponent} from "./timer-item/timer-item.component";
import {TimersListComponent} from "./timers-list/timers-list.component";
import {TimerEndedComponent} from "./timer-ended/timer-ended.component";
import {TimerDetailsComponent} from "./timer-details/timer-details.component";
import {SharedModule} from "../shared/shared.module";
import {TimeLeftOrDurationComponent} from "./time-left-or-duration/time-left-or-duration.component";
import {TimeModule} from "../AppFedShared/time/time.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    MomentModule,
    RouterModule.forChild([{ path: '', component: TimersPageComponent }]),
    SharedModule,
    IonicModule.forRoot(),
    TimeModule,
  ],
  declarations: [
    TimersPageComponent, TimerItemComponent, TimersListComponent, TimerEndedComponent,
    TimerDetailsComponent, TimeLeftOrDurationComponent
  ],
  entryComponents: [
    TimerDetailsComponent,
    TimerEndedComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TimersPageModule {}
