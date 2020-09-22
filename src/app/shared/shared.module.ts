import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {RichTextComponent} from '../libs/AppFedShared/rich-text/rich-text/rich-text.component'
import {EditorModule} from '@tinymce/tinymce-angular'

let imports = [
  ReactiveFormsModule,
  FormsModule,
];

@NgModule({
    entryComponents: [],
  imports: [
    IonicModule.forRoot(),
    ...imports,
    EditorModule,
  ],
    exports: [
        imports,
        RichTextComponent,
    ],
    providers: [],
    declarations: [
        RichTextComponent,
    ],
})
export class SharedModule {
}
