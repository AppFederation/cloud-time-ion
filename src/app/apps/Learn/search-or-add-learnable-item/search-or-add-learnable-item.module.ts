import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SearchOrAddLearnableItemPageComponent } from './search-or-add-learnable-item.page';
import {OdmModule} from '../../../libs/AppFedShared/odm/odm.module'
import {ActionableItemComponent} from './actionable-item/actionable-item.component'
import {MicComponent} from './mic/mic.component'
import {AngularFireStorageModule} from '@angular/fire/storage'
import {LearnSharedModule} from '../shared/learn-shared.module'
import {TestItemComponent} from './test-item/test-item.component'
import {LearnStatsComponent} from './learn-stats/learn-stats.component'
import {SearchOrAddTextEditorComponent} from './search-or-add-text-editor/search-or-add-text-editor.component'
import {EditorModule} from '@tinymce/tinymce-angular'
import {AudioModule} from '../../../libs/AppFedShared/audio/audio.module'
import {SharedModule as SharedModule2} from '../../../shared/shared.module'
import {SimpleListComponent} from './item-lists/simple-list/simple-list.component'
import {ListOptionsComponent} from './list-options/list-options.component'
import {CdkVirtualListComponent} from './item-lists/cdk-virtual-list/cdk-virtual-list.component'
import {ScrollingModule} from '@angular/cdk/scrolling'
import { ScrollingModule as ExperimentalScrollingModule} from '@angular/cdk-experimental/scrolling'
import {SelectionCheckboxComponent} from './actionable-item/selection-checkbox/selection-checkbox.component'
import {SelectionInfoComponent} from './selection-info/selection-info.component'
import {SelectionPopupComponent} from './selection-popup/selection-popup.component'
import {EditSharedModule} from '../../../libs/LifeSuiteShared/edit-shared/edit-shared.module'
import {ItemListSwitcherComponent} from './item-lists/item-list-switcher/item-list-switcher.component'
import {IonVirtualListComponent} from './item-lists/ion-virtual-list/ion-virtual-list.component';
import { ListTypeDirective } from './item-lists/item-list-switcher/list-type.directive'
import {BrowserModule} from '@angular/platform-browser'

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
    LearnSharedModule,
    SharedModule2,
    EditorModule,
    ReactiveFormsModule,
    AudioModule,
    LearnSharedModule,
    ExperimentalScrollingModule,
    ScrollingModule,
    EditSharedModule,
  ],
  declarations: [
    SearchOrAddLearnableItemPageComponent,
    ActionableItemComponent,
    MicComponent,
    TestItemComponent,
    LearnStatsComponent,
    SearchOrAddTextEditorComponent,
    SimpleListComponent,
    CdkVirtualListComponent,
    ListOptionsComponent,
    SelectionCheckboxComponent,
    SelectionInfoComponent,
    SelectionPopupComponent,
    ItemListSwitcherComponent,
    IonVirtualListComponent,
    ListTypeDirective,
  ],
  entryComponents: [
    IonVirtualListComponent,
    SimpleListComponent,
    CdkVirtualListComponent,
  ],
})
export class SearchOrAddLearnableItemPageModule {}
