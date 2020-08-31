import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MomentModule} from 'ngx-moment';
import {TimersPageComponent} from './timers-page.component';
import {TimerItemComponent} from "./timer-item/timer-item.component";
import {TimersListComponent} from "./timers-list/timers-list.component";
import {TimerEndedComponent} from "./timer-ended/timer-ended.component";
import {TimerDetailsComponent} from "./timer-details/timer-details.component";
import {SharedModule} from "../shared/shared.module";
import {TimeLeftOrDurationComponent} from "./time-left-or-duration/time-left-or-duration.component";
import {TimeModule} from "../libs/AppFedShared/time/time.module";
import {TimeIonicModule} from "../libs/AppFedSharedIonic/time/time-ionic.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    MomentModule,
    RouterModule.forChild([ { path: '', component: TimersPageComponent } ]),
    SharedModule,
    IonicModule.forRoot(),
    TimeModule,
    TimeIonicModule,
  ],
  declarations: [
    TimersPageComponent,
    TimerItemComponent,
    TimersListComponent,
    TimerEndedComponent,
    TimerDetailsComponent,
    TimeLeftOrDurationComponent,
  ],
  entryComponents: [
    TimerDetailsComponent,
    TimerEndedComponent,
  ],
  exports: [
    TimerItemComponent,
  ],
})
export class TimersPageModule {}
