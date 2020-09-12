import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms'
import {stripHtml} from '../../../../libs/AppFedShared/utils/html-utils'

@Component({
  selector: 'app-search-or-add-text-editor',
  templateUrl: './search-or-add-text-editor.component.html',
  styleUrls: ['./search-or-add-text-editor.component.sass'],
})
export class SearchOrAddTextEditorComponent implements OnInit {

  @Input() formControl1 ! : FormControl

  constructor() { }

  tinyMceInit = {
    placeholder: "Search or add",
    height: 500,
    menubar: false,
    toolbar_location: 'auto', // 'bottom', /* https://www.tiny.cloud/docs/configure/editor-appearance/ */
    toolbar_sticky: true,
    // menubar: false,
    statusbar: false,
    plugins: [
      'advlist autolink lists image charmap print preview anchor' /* link */,
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    paste_data_images: true /* https://www.tiny.cloud/docs/plugins/paste/ */,
    paste_retain_style_properties: 'all', // https://www.tiny.cloud/docs/plugins/powerpaste/ - PowerPaste plugin - (30 eur/month?)
    /* https://www.tiny.cloud/pricing/ -- 30/month - BUT about pasting from Linguee - this should be automated by extension anyway, so probably not worth over-investing in tinymce for that
      see #LingueeService
    * */

    toolbar: false, // https://stackoverflow.com/questions/2628187/tinymce-hide-the-bar
    // toolbar:
    //   'customInsertButton selectall copy paste | undo redo | formatselect | bold italic underline forecolor backcolor | \
    //   alignleft aligncenter alignright alignjustify | \
    //   bullist numlist outdent indent | removeformat | help',
    skin: 'oxide-dark',
    // content_css: 'dark', /* is causing error on console, as this is url part */  // > **Note**: This feature is only available for TinyMCE 5.1 and later.
    entity_encoding: `raw`,
    content_style:
      '[contenteditable] { padding-left: 5px; } ' +
      '[contenteditable] li { padding-top: 6px; } ' +
      '[contenteditable] ::marker { color: red } '
    /* https://www.tiny.cloud/docs/configure/content-appearance/
      padding to be able to see cursor when it's close to focus border
      [contenteditable] a { color: #98aed9 }
      */,
    setup: (editor: any) => {
      editor.addShortcut(
        'meta+e', 'Add yellow highlight to selected text.', () => {
          // https://www.tiny.cloud/docs/advanced/keyboard-shortcuts/
          this.highlightSelected(editor)
        });
      editor.ui.registry.addButton('customInsertButton', {
        /* https://www.tiny.cloud/docs/demo/custom-toolbar-button/ */
        text: 'MARK',
        onAction: () => {
          this.highlightSelected(editor)
          // editor.insertContent('&nbsp;<strong>It\'s my button!</strong>&nbsp;');
        }
      });
    }
  }

  public highlightSelected(editor: any) {
    editor.execCommand('hilitecolor', false, /*'#808000'*/ '#ffa626');
  }


  ngOnInit() {
    this.formControl1.valueChanges.subscribe(val => {
      console.log(`stripped html`, stripHtml(val), `orig:`, val)
    })
  }

}
