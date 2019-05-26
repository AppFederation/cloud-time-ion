import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TimePickerComponent} from "./time-picker/time-picker.component";
import {TimeModule} from "../../AppFedShared/time/time.module";

const exports = [
  TimePickerComponent,
];

@NgModule({
  declarations: [
    ...exports
  ],
  imports: [
    CommonModule,
    TimeModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  exports: [
    exports
  ]
})
export class TimeIonicModule { }
