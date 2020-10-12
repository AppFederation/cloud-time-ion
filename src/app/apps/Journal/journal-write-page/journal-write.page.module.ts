import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JournalWritePageRoutingModule } from './journal-write.page-routing.module';
import {IonicModule} from "@ionic/angular";
import {JournalWritePage} from "./journal-write.page";
import {NumericPickerComponent} from "../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component";
import {JournalNumericFieldsComponent} from './journal-numeric-fields/journal-numeric-fields.component'
import {JournalTextFieldsComponent} from './journal-text-fields/journal-text-fields.component';
import { JournalSituationsComponent } from './journal-situations/journal-situations.component'
import {FormsModule} from '@angular/forms'
import {OdmModule} from '../../../libs/AppFedShared/odm/odm.module'
import {RatingsModule} from '../../../libs/AppFedSharedIonic/ratings/ratings.module'
import {TimeModule} from '../../../libs/AppFedShared/time/time.module'
import {SharedModule} from '../../../shared/shared.module'
import {JournalTextFieldComponent} from './journal-text-fields/journal-text-field/journal-text-field.component'

@NgModule({
  declarations: [
    JournalWritePage,
    JournalNumericFieldsComponent,
    JournalTextFieldsComponent,
    JournalSituationsComponent,
    JournalTextFieldComponent,
  ],
  imports: [
    CommonModule,
    JournalWritePageRoutingModule,
    IonicModule.forRoot(),
    FormsModule,
    OdmModule,
    RatingsModule,
    TimeModule,
    SharedModule,
  ],
    exports: [
    ],
})
export class JournalWritePageModule { }
