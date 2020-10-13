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
import {SharedModule} from '../shared/shared.module'
import {TestItemComponent} from './test-item/test-item.component'
import {LearnStatsComponent} from './learn-stats/learn-stats.component'
import {SearchOrAddTextEditorComponent} from './search-or-add-text-editor/search-or-add-text-editor.component'
import {EditorModule} from '@tinymce/tinymce-angular'
import {AudioModule} from '../../../libs/AppFedShared/audio/audio.module'

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
        SharedModule,
        EditorModule,
        ReactiveFormsModule,
        AudioModule,
    ],
    declarations: [
        SearchOrAddLearnableItemPageComponent,
        ActionableItemComponent,
        MicComponent,
        TestItemComponent,
        LearnStatsComponent,
        SearchOrAddTextEditorComponent,
    ],
})
export class SearchOrAddLearnableItemPageModule {}
