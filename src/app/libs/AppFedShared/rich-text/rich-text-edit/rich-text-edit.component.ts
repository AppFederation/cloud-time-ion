import {Component, Inject, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {ViewSyncer} from '../../odm/ui/ViewSyncer'
import {EditorComponent} from '@tinymce/tinymce-angular'
import {UntypedFormControl} from '@angular/forms'
import {debugLog} from '../../utils/log'
import {EditorService} from './editor.service'
import {richTextEditCommon} from './RichTextEditCommon'
import {cellDirections, CellNavigationService} from '../../cell-navigation.service'
import {AbstractCellComponent} from '../../AbstractCellComponent'
import {getSelectionCursorState} from '../../utils/caret-utils'

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
export class RichTextEditComponent extends AbstractCellComponent implements OnInit {

  @Input() viewSyncer ? : ViewSyncer

  @Input() formControl1 ! : UntypedFormControl

  /* TODO maybe put them in one @Input() config or options */
  @Input() placeholder = ''

  @Input() showToolbar = true

  @Input() showMenuBar = true

  /** workaround for searchOrAdd not updating when deleting all text at once */
  @Input() enableModelEventNodeChange = false

  @Input() showClearButton: boolean = false

  /** Used in search-or-add (because enter creates a new item). */
  @Input() enterKeyOnlyWithShift: boolean = false

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


  tinyMceInit: any

  constructor(
    public editorService: EditorService,
    injector: Injector
  ) {
    super(injector)
  }


  override ngOnInit() {
    super.ngOnInit()
    this.tinyMceInit = {
      base_url: '/assets/tinymce', // Root for resources
      suffix: '.min',        // Suffix to use when loading resources
      /* https://www.tiny.cloud/docs/integrations/angular/
      * https://www.tiny.cloud/docs/tinymce/6/invalid-api-key/#what-will-happen-if-i-dont-provide-a-valid-api-key
      * https://www.tiny.cloud/blog/get-started-with-tinymce-self-hosted/
      * https://www.tiny.cloud/get-tiny/self-hosted/
      * https://www.tiny.cloud/docs/general-configuration-guide/advanced-install/#packagemanagerinstalloptions
      * https://chat.openai.com/c/4daefc17-f0da-40b8-bd25-a2f229081025 --> this gave the info that made it work: angular.json:
      *     "scripts": [
              "src/assets/tinymce/tinymce.min.js"
            ],
      *  */


      // placeholder: "Search or add" /* https://www.tiny.cloud/blog/tinymce-placeholder-text/ */,
      placeholder: this.placeholder,
      height: 500,
      menubar: this.showMenuBar,
      mobile: { /** https://www.tiny.cloud/docs/mobile/#configuringmobile */
        /* TODO try toolbar_sticky in mobile: https://www.tiny.cloud/docs/configure/editor-appearance/#toolbar_sticky */
        menubar: this.showMenuBar /* https://www.tiny.cloud/docs/configure/editor-appearance/#menubar */,
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
        // https://www.tiny.cloud/docs/plugins/opensource/
        'advlist autolink lists image charmap print preview anchor' /* link */,
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount hr'
      ],
      formats: { /* https://www.tiny.cloud/docs/demo/format-custom/ --> CodePen; also check badge format
      https://www.tiny.cloud/docs/configure/content-formatting/#built-informats
      */
        done: {inline: 'span', classes: 'done-text'},
        fancy: {inline: 'span', classes: 'fancy'},
        warning: {inline: 'span', classes: 'warning'},
        negative: {inline: 'span', classes: 'negative'},
        positive: {inline: 'span', classes: 'positive'},
        concept: {inline: 'span', classes: 'concept'},
        sourceCode: {inline: 'pre', classes: 'source-code'},
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
            { title: 'pre', block: 'pre' },
            { title: 'code', format: 'sourceCode' },
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
      toolbar: this.showToolbar ?
        'customMarkBtn btnFormatDone btnFormatPositive btnFormatNegative btnFormatWarning btnFormatFancy btnFormatConcept \
        bullist numlist outdent indent | bold italic underline strikethrough blockquote forecolor backcolor | \
        selectall copy paste | undo redo | \
        formatselect | hr | \
        alignleft aligncenter alignright alignjustify ' /* align is probably quite useless for notes */ +
        ' | removeformat | help' : false,
      skin: 'oxide-dark',
      // content_css: 'dark', /* is causing error on console, as this is url part */  // > **Note**: This feature is only available for TinyMCE 5.1 and later.
      entity_encoding: `raw`,
      /** https://www.tiny.cloud/docs/configure/content-filtering/#valid_classes */
      valid_classes: richTextEditCommon.valid_classes,
      content_style: ''
      // '[contenteditable] { padding-left: 5px; } ' +
      // // '[contenteditable] ul { padding-inline-start: 1rem; } ' +
      // // '[contenteditable] li { padding-top: 6px; } ' +
      // // '[contenteditable] ::marker { color: var(--secondary); ' +
      // '[contenteditable] ul ::marker { color: var(--secondary); ' +
      // '[contenteditable] ::marker { color: var(--secondary); ' +
      //   '/* does not seem to work: */ text-shadow: 2px 2px #ffffff; } ' +
      // `blockquote { border-left: 3px var(--secondary) solid; padding-left: 6px; margin-left: 20px } ` + /* TODO: extract standard rich text css into global const for -edit and -view */
      // `ul { padding-inline-start: 0px; }` +
      // `ol { padding-inline-start: 20px; }` +
      // `section { border: 2px solid #b02020; padding: 3px; margin: 2px; border-radius: 4px;  }` +
      // `ul { border: 2px solid #101010; padding: 3px; margin: 2px; border-radius: 4px;  }` +
      // + `ol { border-left: 2px solid #801010; }`
      // + `ul { border-left: 2px solid #801010; }`
      // `ol { border: 2px solid #101010; padding: 3px; margin: 2px; border-radius: 4px;  }`
      /* https://www.tiny.cloud/docs/configure/content-appearance/
        padding to be able to see cursor when it's close to focus border
        [contenteditable] a { color: #98aed9 }
        */,
      setup: (editor: any) => {
        console.log('setup')
        editor.on('keydown', (event: any) => {
          if ( this.enterKeyOnlyWithShift ) {
            if (event.keyCode == 13) {
              if ( ! event.shiftKey ) {
                // NOTE - this is what prevented alt+enter?
                // .shiftKey .metaKey .altKey .ctrlKey
                // console.log(`Enter key`, event)
                event.preventDefault();
                event.stopPropagation();
                return false;
              }
            }
          }
          /// ==== new:
          // /* prevent alt+enter */
          // if (event.altKey && event.keyCode == 13) {
          //   console.log(`editor.on('keydown'`)
          //   event.stopPropagation();
          //   event.preventDefault();
          //   // You can add any additional code here to handle the Alt+Enter event
          // }
        });
        editor.addShortcut(
          'meta+e', 'Add yellow highlight to selected text.', () => {
            // https://www.tiny.cloud/docs/advanced/keyboard-shortcuts/
            this.highlightSelected(editor)
          });
        editor.addShortcut(
          'ctrl+m', 'Add yellow highlight to selected text.', () => {
            // https://www.tiny.cloud/docs/advanced/keyboard-shortcuts/
            this.highlightSelected(editor)
          });
        editor.addShortcut('ctrl+b', 'Bullet points style', function(){
          editor.execCommand('InsertUnorderedList');
        });
        editor.addShortcut('ctrl+shift+b', 'Numbered Bullet points style', function(){
          editor.execCommand('InsertOrderedList');
        });
        editor.addShortcut('ctrl+d', 'Done style ', function(){
          editor.formatter.toggle('done');
        });
        editor.addShortcut('ctrl+p', 'Positive style ', function(){
          editor.formatter.toggle('positive');
        });
        editor.addShortcut('ctrl+e', 'Positive style ', function(){
          editor.formatter.toggle('positive');
        });
        editor.addShortcut('ctrl+n', 'Negative style ', function(){
          editor.formatter.toggle('negative');
        });
        editor.addShortcut('ctrl+w', 'Warning style ', function(){
          editor.formatter.toggle('warning');
        });
        editor.addShortcut('ctrl+f', 'Fancy style ', function(){
          editor.formatter.toggle('fancy');
        });
        editor.addShortcut('ctrl+c', 'Concept style ', function(){
          editor.formatter.toggle('concept');
        });
        editor.ui.registry.addButton('customMarkBtn', {
          /* https://www.tiny.cloud/docs/demo/custom-toolbar-button/ */
          text: 'M',
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
        }); //  btnFormatWarning btnFormatFancy btnFormatConcept
        editor.ui.registry.addButton('btnFormatNegative', {
          text: 'N',
          onAction: () => {
            this.formatNegative(editor)
          }
        });
        editor.ui.registry.addButton('btnFormatWarning', {
          text: 'W',
          onAction: () => {
            this.formatWarning(editor)
          }
        });
        editor.ui.registry.addButton('btnFormatFancy', {
          text: 'F',
          onAction: () => {
            this.formatFancy(editor)
          }
        });
        editor.ui.registry.addButton('btnFormatConcept', {
          text: 'C',
          onAction: () => {
            this.formatConcept(editor)
          }
        });
        editor.ui.registry.addButton('btnFormatDone', {
          text: 'D',
          onAction: () => {
            this.formatDone(editor)
          }
        });
      }
    }

  }


  public highlightSelected(editor: any) {
    editor.execCommand('hilitecolor', false, /*'#808000'*/ '#ffa626');
  }

  public formatPositive(editor: any) {
    editor.execCommand('mceToggleFormat', true, 'positive');
  }

  public formatNegative(editor: any) {
    editor.execCommand('mceToggleFormat', true, 'negative');
  }

  public formatWarning(editor: any) {
    editor.execCommand('mceToggleFormat', true, 'warning');
  }

  public formatFancy(editor: any) {
    editor.execCommand('mceToggleFormat', true, 'fancy');
  }

  public formatConcept(editor: any) {
    editor.execCommand('mceToggleFormat', true, 'concept');
  }

  public formatDone(editor: any) {
    editor.execCommand('mceToggleFormat', true, 'done');
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

  public focusCellAbove($event: any) {
    // console.log('focusCellAbove')
    if ( this.feat.buggy && getSelectionCursorState().atStart ) {
      this.cellNavigationService.navigateToCellVisuallyInDirection(cellDirections.up, this)
      // console.log('Will navi up')
    }
  }
  public focusCellBelow($event: any) {
    // console.log('focusCellBelow')
    if ( this.feat.buggy && getSelectionCursorState().atEnd ) {
      // could be ngrx actions
      this.cellNavigationService.navigateToCellVisuallyInDirection(cellDirections.down, this)
      // console.log('Will navi down')
    }
  }

  /* override */ focus() {
    this.focusEditor()
  }

}
