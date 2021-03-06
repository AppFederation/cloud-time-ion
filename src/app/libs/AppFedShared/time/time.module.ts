import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TimePassingComponent} from "./time-passing/time-passing.component";
import {TimeViewComponent} from "./time-view/time-view.component";
import {TimePickerComponent} from "../../AppFedSharedIonic/time/time-picker/time-picker.component";
import {NumberPickerComponent} from "./number-picker/number-picker.component";
import {SharedModule} from "../../../shared/shared.module";
import {IonicModule} from "@ionic/angular";
import {TimePointComponent} from './time-point/time-point.component'

let exports = [
  NumberPickerComponent,
  TimePassingComponent,
  TimeViewComponent,
  TimePointComponent,
]

@NgModule({
  declarations: [
    ...exports,
  ],
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
  ],
  exports: exports,
})
export class TimeModule { }
