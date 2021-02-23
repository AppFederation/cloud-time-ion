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
import {ScrollingModule} from '@angular/cdk/scrolling'
import { ScrollingModule as ExperimentalScrollingModule} from '@angular/cdk-experimental/scrolling';
import {TimeModule} from '../../../libs/AppFedShared/time/time.module'
import {TimelineListOptionsComponent} from './timeline-list-options/timeline-list-options.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JournalEntriesListPageRoutingModule,
    OdmModule,
    SharedModule,
    ScrollingModule,
    ExperimentalScrollingModule,
    TimeModule,
  ],
  declarations: [
    JournalEntriesListPage,
    JournalEntryListItemComponent,
    JournalNumFieldsViewComponent,
    JournalTextFieldsViewComponent,
    TimelineListOptionsComponent,
  ],
})
export class JournalEntriesListPageModule {}
