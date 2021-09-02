import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ViewSyncer} from '../../odm/ui/ViewSyncer'
import {EditorComponent} from '@tinymce/tinymce-angular'
import {FormControl} from '@angular/forms'
import {debugLog} from '../../utils/log'
import {EditorService} from './editor.service'
import {richTextEditCommon} from './RichTextEditCommon'

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
    mobile: { /** https://www.tiny.cloud/docs/mobile/#configuringmobile */
      /* TODO try toolbar_sticky in mobile: https://www.tiny.cloud/docs/configure/editor-appearance/#toolbar_sticky */
      menubar: true /* https://www.tiny.cloud/docs/configure/editor-appearance/#menubar */,
      // menubar_mode: 'scrolling',
      // toolbar_mode: 'scrolling',
      menu: { /* https://www.tiny.cloud/docs/configure/editor-appearance/#menu */
        file: {title: 'File', items: 'newdocument restoredraft | preview | print '},
        edit: {title: 'Edt', items: 'undo redo | cut copy paste | selectall | searchreplace'},
        view: {title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen'},
        insert: {
          title: 'Ins',
          items: 'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime'
        },
        format: {
          title: 'Fmt',
          items: 'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat'
        },
        tools: {title: 'Tls', items: 'spellchecker spellcheckerlanguage | code wordcount'},
        table: {title: 'Tbl', items: 'inserttable | cell row column | tableprops deletetable'},
        help: { title: 'Hlp', items: 'help' }
      }
    },
    toolbar_location: 'auto', // 'bottom', /* https://www.tiny.cloud/docs/configure/editor-appearance/ */
    toolbar_sticky: true,
    // menubar: false,
    statusbar: false,
    plugins: [
      'advlist autolink lists image charmap print preview anchor' /* link */,
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    formats: { /* https://www.tiny.cloud/docs/demo/format-custom/ --> CodePen; also check badge format
      https://www.tiny.cloud/docs/configure/content-formatting/#built-informats
      */
      fancy: {inline: 'span', classes: 'fancy'},
      warning: {inline: 'span', classes: 'warning'},
      negative: {inline: 'span', classes: 'negative'},
      positive: {inline: 'span', classes: 'positive'},
      concept: {inline: 'span', classes: 'concept'},
    },
    style_formats: [ /* https://www.tiny.cloud/docs/demo/format-html5/ */
      {
        title: `Fancy`,
        format: 'fancy',
      },
      {
        title: `Negative`,
        format: 'negative',
      },
      {
        title: `Warning`,
        format: 'warning',
      },
      {
        title: `Positive`,
        format: 'positive',
      },
      {
        title: `Concept`,
        format: 'concept',
      },
      { title: 'Headers', items: [
          { title: 'h1', block: 'h1' },
          { title: 'h2', block: 'h2' },
          { title: 'h3', block: 'h3' },
          { title: 'h4', block: 'h4' },
          { title: 'h5', block: 'h5' },
          { title: 'h6', block: 'h6' }
        ] },

      { title: 'Blocks', items: [
          { title: 'p', block: 'p' },
          { title: 'div', block: 'div' },
          { title: 'pre', block: 'pre' }
        ] },

      { title: 'Containers', items: [
          { title: 'section', block: 'section', wrapper: true, merge_siblings: false },
          { title: 'article', block: 'article', wrapper: true, merge_siblings: false },
          { title: 'blockquote', block: 'blockquote', wrapper: true },
          { title: 'hgroup', block: 'hgroup', wrapper: true },
          { title: 'aside', block: 'aside', wrapper: true },
          { title: 'figure', block: 'figure', wrapper: true }
        ] }
    ],
    paste_data_images: true /* https://www.tiny.cloud/docs/plugins/paste/ */,
    paste_retain_style_properties: 'all', // https://www.tiny.cloud/docs/plugins/powerpaste/ - PowerPaste plugin - (30 eur/month?)
    /* https://www.tiny.cloud/pricing/ -- 30/month - BUT about pasting from Linguee - this should be automated by extension anyway, so probably not worth over-investing in tinymce for that
      see #LingueeService
    * */

    // toolbar: false, // https://stackoverflow.com/questions/2628187/tinymce-hide-the-bar
    toolbar:
      'customMarkBtn btnFormatPositive bullist numlist outdent indent | bold italic underline strikethrough blockquote forecolor backcolor | \
      selectall copy paste | undo redo | \
      formatselect | \
      alignleft aligncenter alignright alignjustify ' /* align is probably quite useless for notes */ +
      ' | removeformat | help',
    skin: 'oxide-dark',
    // content_css: 'dark', /* is causing error on console, as this is url part */  // > **Note**: This feature is only available for TinyMCE 5.1 and later.
    entity_encoding: `raw`,
    /** https://www.tiny.cloud/docs/configure/content-filtering/#valid_classes */
    valid_classes: richTextEditCommon.valid_classes,
    content_style:
      '[contenteditable] { padding-left: 5px; } ' +
      '[contenteditable] li { padding-top: 6px; } ' +
      '[contenteditable] ::marker { color: var(--secondary); ' +
        '/* does not seem to work: */ text-shadow: 2px 2px #ffffff; } ' +
      `blockquote { border-left: 3px var(--secondary) solid; padding-left: 6px; margin-left: 20px } ` + /* TODO: extract standard rich text css into global const for -edit and -view */
      `ul { padding-inline-start: 20px; }` +
      `ol { padding-inline-start: 20px; }` +
      `section { border: 2px solid #b02020; padding: 3px; margin: 2px; border-radius: 4px;  }`
      // `ul { border: 2px solid #101010; padding: 3px; margin: 2px; border-radius: 4px;  }` +
      + `ol { border-left: 2px solid #801010; }`
      + `ul { border-left: 2px solid #801010; }`
      // `ol { border: 2px solid #101010; padding: 3px; margin: 2px; border-radius: 4px;  }`
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
      editor.ui.registry.addButton('customMarkBtn', {
        /* https://www.tiny.cloud/docs/demo/custom-toolbar-button/ */
        text: 'MARK',
        onAction: () => {
          this.highlightSelected(editor)
          // editor.insertContent('&nbsp;<strong>It\'s my button!</strong>&nbsp;');
        } /* for fancy: `mceToggleFormat` ? - https://www.tiny.cloud/docs/advanced/editor-command-identifiers/ */
      });
      editor.ui.registry.addButton('btnFormatPositive', {
        text: 'P',
        onAction: () => {
          this.formatPositive(editor)
        } /* for fancy: `mceToggleFormat` ? - https://www.tiny.cloud/docs/advanced/editor-command-identifiers/ */
      });
    }
  }


  constructor(
    public editorService: EditorService,
  ) { }


  ngOnInit() {}


  public highlightSelected(editor: any) {
    editor.execCommand('hilitecolor', false, /*'#808000'*/ '#ffa626');
  }

  public formatPositive(editor: any) {
    editor.execCommand('mceToggleFormat', true, 'positive');
  }

  logEditor(msg: string) {
    // debugLog(`tinymce: `, msg)
  }

  focusEditor() {
    setTimeout(() => {
      // debugLog(`focusEditor`, this.editorViewChild)
      this.editorViewChild ?. editor ?. focus()
    }, 10)
  }

  onFocus(b: any) {
    this.editorService.status$.next({
      textEditorFocused: b
    })
    // debugLog(`rich text onFocus`, b) // TODO focusService notify htmlEditorFocused true/false
  }

}
