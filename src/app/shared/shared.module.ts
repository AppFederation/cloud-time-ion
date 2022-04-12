import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {EditorModule} from '@tinymce/tinymce-angular'
import {RichTextViewComponent} from '../libs/AppFedShared/rich-text/rich-text-view/rich-text-view.component'
import {CommonModule} from '@angular/common'
import {ImportanceComponent} from '../libs/AppFedShared/importance/importance.component'
import {RichTextEditComponent} from '../libs/AppFedShared/rich-text/rich-text-edit/rich-text-edit.component'
import {DurationComponent} from '../apps/Learn/quiz/quiz-options/quiz-intervals/duration/duration.component'
import {ChooserComponent} from '../libs/AppFedShared/chooser/chooser/chooser.component'
import {GeoLocComponent} from '../libs/AppFedShared/geo-location/geo-loc/geo-loc.component'
import {OptionsComponent} from '../libs/AppFedShared/options/options.component'
import {SearchToolbarComponent} from '../libs/search/search-toolbar/search-toolbar.component'
import {ImportanceBannerComponent} from '../apps/Learn/shared/importance-banner/importance-banner.component'
import {WhatNextButtonComponent} from './what-next-button/what-next-button.component'
import {RouterModule} from '@angular/router'
import {AppLogoComponent} from '../apps/Common/app-logo/app-logo.component'

let imports = [
  ReactiveFormsModule,
  FormsModule,
];

const exportedDeclarations = [
  RichTextEditComponent,
  RichTextViewComponent,
  ImportanceComponent,
  DurationComponent,
  ChooserComponent,
  GeoLocComponent,
  OptionsComponent,
  SearchToolbarComponent,
  ImportanceBannerComponent,
  WhatNextButtonComponent,
  AppLogoComponent,
]

@NgModule({
    entryComponents: [],
  imports: [
    CommonModule,
    IonicModule,
    ...imports,
    EditorModule,
    RouterModule,
  ],
  exports: [
    ...imports,
    ...exportedDeclarations,
  ],
  providers: [],
  declarations: [
    ...exportedDeclarations,
  ],
})
export class SharedModule {
}
