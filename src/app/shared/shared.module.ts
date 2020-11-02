import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {RichTextComponent} from '../libs/AppFedShared/rich-text/rich-text/rich-text.component'
import {EditorModule} from '@tinymce/tinymce-angular'
import {RichTextViewComponent} from '../libs/AppFedShared/rich-text/rich-text-view/rich-text-view.component'
import {CommonModule} from '@angular/common'
import {ImportanceComponent} from '../libs/AppFedShared/importance/importance.component'

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
      imports,
      RichTextComponent,
      RichTextViewComponent,
    ],
    providers: [],
    declarations: [
      RichTextComponent,
      RichTextViewComponent,
      ImportanceComponent,
    ],
})
export class SharedModule {
}
