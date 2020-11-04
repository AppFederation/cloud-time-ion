import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Side, SidesDefs} from '../../core/sidesDefs'
import {ViewSyncer} from '../../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {FormControl, FormGroup} from '@angular/forms'
import {nullish} from '../../../../libs/AppFedShared/utils/type-utils'
import {LearnItem$} from '../../models/LearnItem$'
import {debugLog} from '../../../../libs/AppFedShared/utils/log'
import {LearnItem} from '../../models/LearnItem'
import {EditorComponent} from '@tinymce/tinymce-angular'

export type SideFormControlsDict = {[key in keyof SidesDefs]: FormControl }


// TODO: escape key to hide toolbar&menu bar
@Component({
  selector: 'app-item-side-editor',
  templateUrl: './item-side.component.html',
  styleUrls: ['./item-side.component.sass'],
})
export class ItemSideComponent implements OnInit {

  @Input() item$ ! : LearnItem$

  @Input() side ! : Side | nullish

  formControls ! : SideFormControlsDict

  formGroup ! : FormGroup

  editorOpened = false

  private _editorViewChild: EditorComponent | undefined

  @ViewChild(EditorComponent) set editorViewChild(ed: EditorComponent | undefined) {
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

  get formControl() {
    return this.formControls[this.side!.id]
  }

  /** TODO     *ngIf="viewSyncer.initialDataArrived else notLoaded" */
  viewSyncer ! : ViewSyncer

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
      'customInsertButton selectall copy paste | undo redo | formatselect | bold italic underline forecolor backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | help',
    skin: 'oxide-dark',
    // content_css: 'dark', /* is causing error on console, as this is url part */  // > **Note**: This feature is only available for TinyMCE 5.1 and later.
    entity_encoding: `raw`,
    content_style:
      '[contenteditable] { padding-left: 5px; } ' +
      '[contenteditable] li { padding-top: 6px; } ' +
      '[contenteditable] ::marker { color: var(--secondary) } ' +
      `ul { padding-inline-start: 25px; }` +
      `ol { padding-inline-start: 25px; }`

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

  constructor() { }

  ngOnInit() {
    if ( this.side ) {
      this.formControls = this.createFormControlDict()
      this.formGroup = new FormGroup(this.formControls)
      this.viewSyncer = new ViewSyncer(this.formGroup, this.item$, true, this.side !. id as keyof LearnItem) /* TODO might need to ignore other fields from db */
    }
  }

  private createFormControlDict(): SideFormControlsDict {
    const ret = {} as SideFormControlsDict
    ret[this.side !. id] = new FormControl()
    // console.dir(ret)
    return ret
  }

  logEditor(msg: string) {
    debugLog(`tinymce: `, msg)
  }

  focusEditor() {
    setTimeout(() => {
      // debugLog(`focusEditor`, this.editorViewChild)
      this.editorViewChild?.editor.focus()
    }, 10)
  }

  isDependencySatisfied(): boolean {
    return true // for convenience if I want to cut&paste directly to a field e.g. question2
    // if ( ! this.side?.dependsOn ) {
    //   return true
    // } else {
    //   // debugLog(`isDependencySatisfied`, this.side, this.formControls[this.side.dependsOn.id]?.value?.trim(), this.formControls)
    //   return !! (this.item$?.currentVal?.[this.side.dependsOn.id as keyof LearnItem] as any as string)?.trim()
    //   // return this.formControls[this.side.dependsOn.id]?.value
    //   // return !! (this.formControls[this.side.dependsOn.id]?.value?.trim())
    // }
  }

  onChangeEditor($event: any) {
    // hack
    if ( $event?.length === 0 ) {
      debugLog(`onChangeEditor empty`, $event)
    }
  }
}
