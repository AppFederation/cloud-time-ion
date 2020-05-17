import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JournalWritePageRoutingModule } from './journal-write.page-routing.module';
import {IonicModule} from "@ionic/angular";
import {JournalWritePage} from "./journal-write.page";
import {NumericPickerComponent} from "./numeric-picker/numeric-picker.component";
import {JournalNumericFieldsComponent} from './journal-numeric-fields/journal-numeric-fields.component'
import {JournalTextFieldsComponent} from './journal-text-fields/journal-text-fields.component';
import { JournalSituationsComponent } from './journal-situations/journal-situations.component'
import {FormsModule} from '@angular/forms'
import {OdmModule} from '../../../libs/AppFedShared/odm/odm.module'

@NgModule({
  declarations: [
    JournalWritePage,
    NumericPickerComponent,
    JournalNumericFieldsComponent,
    JournalTextFieldsComponent,
    JournalSituationsComponent,
  ],
  imports: [
    CommonModule,
    JournalWritePageRoutingModule,
    IonicModule.forRoot(),
    FormsModule,
    OdmModule,
  ],
})
export class JournalWritePageModule { }
