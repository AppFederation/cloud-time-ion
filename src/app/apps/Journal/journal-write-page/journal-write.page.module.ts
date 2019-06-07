import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JournalWritePageRoutingModule } from './journal-write.page-routing.module';
import {IonicModule} from "@ionic/angular";
import {JournalWritePage} from "./journal-write.page";
import {MoodPickerComponent} from "./mood-picker/mood-picker.component";

@NgModule({
  declarations: [
    JournalWritePage,
    MoodPickerComponent,
  ],
  imports: [
    CommonModule,
    JournalWritePageRoutingModule,
    IonicModule.forRoot(),
  ]
})
export class JournalWritePageModule { }
