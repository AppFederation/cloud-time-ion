import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JournalEntriesListPageRoutingModule } from './journal-entries-list-routing.module';

import { JournalEntriesListPage } from './journal-entries-list.page';
import {JournalEntryListItemComponent} from '../../../timers/timers-list/journal-entry-list-item/journal-entry-list-item.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JournalEntriesListPageRoutingModule
  ],
    declarations: [JournalEntriesListPage, JournalEntryListItemComponent],
})
export class JournalEntriesListPageModule {}
