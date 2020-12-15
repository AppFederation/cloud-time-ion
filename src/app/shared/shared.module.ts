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

let imports = [
  ReactiveFormsModule,
  FormsModule,
];

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
    RichTextEditComponent,
    RichTextViewComponent,
    DurationComponent,
    ChooserComponent,
    GeoLocComponent,
  ],
    providers: [],
  declarations: [
    RichTextEditComponent,
    RichTextViewComponent,
    ImportanceComponent,
    DurationComponent,
    ChooserComponent,
    GeoLocComponent,
  ],
})
export class SharedModule {
}
