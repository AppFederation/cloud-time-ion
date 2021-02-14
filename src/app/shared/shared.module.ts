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

let imports = [
  ReactiveFormsModule,
  FormsModule,
];

const declarations = [
  RichTextEditComponent,
  RichTextViewComponent,
  ImportanceComponent,
  DurationComponent,
  ChooserComponent,
  GeoLocComponent,
  OptionsComponent,
]

@NgModule({
    entryComponents: [],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    ...imports,
    EditorModule,
  ],
    exports: [
        ...imports,
        ...declarations,
        SearchToolbarComponent,
        ImportanceBannerComponent,
    ],
  providers: [],
    declarations: [
        declarations,
        SearchToolbarComponent,
        ImportanceBannerComponent,
    ],
})
export class SharedModule {
}
