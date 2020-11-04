import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ViewSyncer} from '../../odm/ui/ViewSyncer'
import {EditorComponent} from '@tinymce/tinymce-angular'
import {FormControl} from '@angular/forms'
import {debugLog} from '../../utils/log'

/**
 * http://ckeditor.github.io/editor-recommendations/about/
 *
 * https://medium.engineering/why-contenteditable-is-terrible-122d8a40e480
 *
 **/
@Component({
  selector: 'app-rich-text-edit',
  templateUrl: './rich-text-edit.component.html',
  styleUrls: ['./rich-text-edit.component.sass'],
})
export class RichTextEditComponent implements OnInit {

  @Input() viewSyncer ! : ViewSyncer

  @Input() formControl1 ! : FormControl

  @Input() showClearButton: boolean = false

  private _editorViewChild: EditorComponent | undefined

  /* TODO rename editorWasOrIsOpened */
  editorOpened = false

  @ViewChild(EditorComponent)
  set editorViewChild(ed: EditorComponent | undefined) {
    if ( ed ) {
      setTimeout(() => {
        this.editorOpened = true /* prevent tinymce side editor from disappearing after deleting content:
          for preserving undo and to prevent tinymce error when disappeared
          */
      }, 10)
    }
    this._editorViewChild = ed
  }

  get editorViewChild() {
    return this._editorViewChild
  }


  tinyMceInit = {
    height: 500,
    menubar: true,
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

    // toolbar: false, // https://stackoverflow.com/questions/2628187/tinymce-hide-the-bar
    toolbar:
      'customInsertButton selectall copy paste | undo redo | formatselect | blockquote bold italic underline forecolor backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | help',
    skin: 'oxide-dark',
    // content_css: 'dark', /* is causing error on console, as this is url part */  // > **Note**: This feature is only available for TinyMCE 5.1 and later.
    entity_encoding: `raw`,
    content_style:
      '[contenteditable] { padding-left: 5px; } ' +
      '[contenteditable] li { padding-top: 6px; } ' +
      '[contenteditable] ::marker { color: var(--secondary); ' +
        '/* does not seem to work: */ text-shadow: 2px 2px #ffffff; } ' +
      `blockquote { border-left: 3px var(--secondary) solid; padding-left: 6px; margin-left: 20px } ` + /* TODO: extract standard rich text css into global const for -edit and -view */
      `ul { padding-inline-start: 20px; }` +
      `ol { padding-inline-start: 20px; }`
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


  constructor() { }

  ngOnInit() {}


  public highlightSelected(editor: any) {
    editor.execCommand('hilitecolor', false, /*'#808000'*/ '#ffa626');
  }

  logEditor(msg: string) {
    debugLog(`tinymce: `, msg)
  }

  focusEditor() {
    setTimeout(() => {
      // debugLog(`focusEditor`, this.editorViewChild)
      this.editorViewChild ?. editor ?. focus()
    }, 10)
  }

  onFocus(b: any) {
    debugLog(`rich text onFocus`, b) // TODO focusService notify htmlEditorFocused true/false
  }

}
