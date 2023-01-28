import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SearchOrAddLearnableItemPageComponent } from './search-or-add-learnable-item.page';
import {OdmModule} from '../../../libs/AppFedShared/odm/odm.module'
import {ActionableItemComponent} from './actionable-item/actionable-item.component'
import {MicComponent} from './mic/mic.component'
import {AngularFireStorageModule} from '@angular/fire/compat/storage'
import {LearnSharedModule} from '../shared/learn-shared.module'
import {TestItemComponent} from './test-item/test-item.component'
import {LearnStatsComponent} from './learn-stats/learn-stats.component'
import {SearchOrAddTextEditorComponent} from './search-or-add-text-editor/search-or-add-text-editor.component'
import {EditorModule} from '@tinymce/tinymce-angular'
import {AudioModule} from '../../../libs/AppFedShared/audio/audio.module'
import {SharedModule, SharedModule as SharedModule2} from '../../../shared/shared.module'
import {ListOptionsComponent} from './list-options/list-options.component'
import {SelectionCheckboxComponent} from './actionable-item/selection-checkbox/selection-checkbox.component'
import {SelectionInfoComponent} from './selection-info/selection-info.component'
import {SelectionPopupComponent} from './selection-popup/selection-popup.component'
import {EditSharedModule} from '../../../libs/LifeSuiteShared/edit-shared/edit-shared.module'
import {ItemListComponent} from './item-list/item-list.component'

const routes: Routes = [
  {
    path: '',
    component: SearchOrAddLearnableItemPageComponent
  }
];

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      IonicModule,
      RouterModule.forChild(routes),
      OdmModule,
      AngularFireStorageModule,
      SharedModule2,
      EditorModule,
      ReactiveFormsModule,
      AudioModule,
      LearnSharedModule,
      EditSharedModule,
      SharedModule,
    ],
  declarations: [
    SearchOrAddLearnableItemPageComponent,
    ActionableItemComponent,
    MicComponent,
    TestItemComponent,
    LearnStatsComponent,
    SearchOrAddTextEditorComponent,
    ListOptionsComponent,
    SelectionCheckboxComponent,
    SelectionInfoComponent,
    SelectionPopupComponent,
    ItemListComponent,
  ],
})
export class SearchOrAddLearnableItemPageModule {}
