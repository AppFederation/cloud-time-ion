import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {UntypedFormControl} from '@angular/forms'
import {stripHtml} from '../../../../libs/AppFedShared/utils/html-utils'
import {RichTextInterceptorService} from '../../shared/utils/rich-text-interceptor.service'
import {ChromeExtensionService} from '../../shared/utils/chrome-extension.service'
import {richTextEditCommon} from '../../../../libs/AppFedShared/rich-text/rich-text-edit/RichTextEditCommon'

@Component({
  selector: 'app-search-or-add-text-editor',
  templateUrl: './search-or-add-text-editor.component.html',
  styleUrls: ['./search-or-add-text-editor.component.scss'],
  // disable encapsulation to allow styling of tinymce (no longer needed prolly cos moved to global styles)
  encapsulation: ViewEncapsulation.None,
})
export class SearchOrAddTextEditorComponent implements OnInit {

  @Input() formControl1 ! : UntypedFormControl

  constructor(private richTextInterceptor: RichTextInterceptorService) {
    if (ChromeExtensionService.isApplicationRunAsChromeExtension()) {
      this.interceptSelectedText();
    }
  }

  // tinyMceInit = {
  //   placeholder: "Search or add" /* https://www.tiny.cloud/blog/tinymce-placeholder-text/ */,
  //   height: 500,
  //   menubar: false,
  //   toolbar_location: 'auto', // 'bottom', /* https://www.tiny.cloud/docs/configure/editor-appearance/ */
  //   toolbar_sticky: true,
  //   // menubar: false,
  //   statusbar: false,
  //   plugins: [
  //     'advlist autolink lists image charmap print preview anchor' /* link */,
  //     'searchreplace visualblocks code fullscreen',
  //     'insertdatetime media table paste code help wordcount'
  //   ],
  //   paste_data_images: true /* https://www.tiny.cloud/docs/plugins/paste/ */,
  //   paste_retain_style_properties: 'all', // https://www.tiny.cloud/docs/plugins/powerpaste/ - PowerPaste plugin - (30 eur/month?)
  //   /* https://www.tiny.cloud/pricing/ -- 30/month - BUT about pasting from Linguee - this should be automated by extension anyway, so probably not worth over-investing in tinymce for that
  //     see #LingueeService
  //   * */
  //
  //   toolbar: false, // https://stackoverflow.com/questions/2628187/tinymce-hide-the-bar
  //   // toolbar:
  //   //   'customInsertButton selectall copy paste | undo redo | formatselect | bold italic underline forecolor backcolor | \
  //   //   alignleft aligncenter alignright alignjustify | \
  //   //   bullist numlist outdent indent | removeformat | help',
  //   skin: 'oxide-dark',
  //   // content_css: 'dark', /* is causing error on console, as this is url part */  // > **Note**: This feature is only available for TinyMCE 5.1 and later.
  //   entity_encoding: `raw`,
  //   valid_classes: richTextEditCommon.valid_classes,
  //   content_style: '' /* DO NOT use this; as they should look the same in list items etc. */
  //     // '[contenteditable] { padding-left: 5px; } ' +
  //     // '[contenteditable] li { padding-top: 6px; } ' +
  //     // '[contenteditable] ::marker { color: red } '
  //   /* https://www.tiny.cloud/docs/configure/content-appearance/
  //     padding to be able to see cursor when it's close to focus border
  //     [contenteditable] a { color: #98aed9 }
  //     */,
  //   setup: (editor: any) => {
  //     // console.log(`setup: editor`, editor)
  //     editor.addShortcut(
  //       'meta+e', 'Add yellow highlight to selected text.', () => {
  //         // https://www.tiny.cloud/docs/advanced/keyboard-shortcuts/
  //         this.highlightSelected(editor)
  //       });
  //     editor.ui.registry.addButton('customInsertButton', {
  //       /* https://www.tiny.cloud/docs/demo/custom-toolbar-button/ */
  //       text: 'M',
  //       onAction: () => {
  //         this.highlightSelected(editor)
  //         // editor.insertContent('&nbsp;<strong>It\'s my button!</strong>&nbsp;');
  //       }
  //     });
  //     // https://community.tiny.cloud/communityQuestion?id=90661000000IegjAAC :
  //     // editor.onKeyDown.add((ed: any, event: any) => {
  //     editor.on('keydown', (event: any) => {
  //       // https://community.tiny.cloud/communityQuestion?id=90661000000MsG2AAK
  //       // console.log(`keydown`, event)
  //       if (event.keyCode == 13) {
  //         if ( ! event.shiftKey ) {
  //           // NOTE - this is what prevented alt+enter?
  //           // .shiftKey .metaKey .altKey .ctrlKey
  //           // console.log(`Enter key`, event)
  //           event.preventDefault();
  //           event.stopPropagation();
  //           return false;
  //         }
  //       }
  //     });
  //   }
  // }

  public highlightSelected(editor: any) {
    editor.execCommand('hilitecolor', false, /*'#808000'*/ '#ffa626');
  }


  ngOnInit() {
    this.formControl1.valueChanges.subscribe(val => {
      // console.log(`stripped html ---`, `===`+ stripHtml(val)+`===`, `--- orig:`, val)
    })
  }

  /** This is for Chrome extension */
  private interceptSelectedText() {
    this.richTextInterceptor.intercept(selectedText => this.formControl1.setValue(selectedText[0]));
  }
}
