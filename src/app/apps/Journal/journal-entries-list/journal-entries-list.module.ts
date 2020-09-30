import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JournalEntriesListPageRoutingModule } from './journal-entries-list-routing.module';

import { JournalEntriesListPage } from './journal-entries-list.page';
import {JournalEntryListItemComponent} from '../../../timers/timers-list/journal-entry-list-item/journal-entry-list-item.component'
import {RichTextViewComponent} from '../../../libs/AppFedShared/rich-text/rich-text-view/rich-text-view.component'
import {JournalNumFieldsViewComponent} from '../../../timers/timers-list/journal-entry-list-item/journal-num-fields-view/journal-num-fields-view.component'
import {OdmModule} from '../../../libs/AppFedShared/odm/odm.module'
import {JournalTextFieldsViewComponent} from '../../../timers/timers-list/journal-entry-list-item/journal-text-fields-view/journal-text-fields-view.component'
import {SharedModule} from '../../../shared/shared.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JournalEntriesListPageRoutingModule,
    OdmModule,
    SharedModule,
  ],
  declarations: [
    JournalEntriesListPage,
    JournalEntryListItemComponent,
    JournalNumFieldsViewComponent,
    JournalTextFieldsViewComponent,
  ],
})
export class JournalEntriesListPageModule {}
