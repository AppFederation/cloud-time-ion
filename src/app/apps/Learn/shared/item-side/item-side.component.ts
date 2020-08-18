import {Component, Input, OnInit} from '@angular/core';
import {Side} from '../../core/sidesDefs'
import {ViewSyncer} from '../../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {FormControl, FormGroup} from '@angular/forms'
import {nullish} from '../../../../libs/AppFedShared/utils/type-utils'
import {LearnItem$} from '../../models/LearnItem$'
import {debugLog} from '../../../../libs/AppFedShared/utils/log'

export type FormControlsDict = {[key: string]: FormControl /* TODO: mapped type */}

@Component({
  selector: 'app-item-side-editor',
  templateUrl: './item-side.component.html',
  styleUrls: ['./item-side.component.sass'],
})
export class ItemSideComponent implements OnInit {

  @Input() item$ ! : LearnItem$

  @Input() side ! : Side | nullish

  formControls ! : FormControlsDict

  formGroup ! : FormGroup


  /** TODO     *ngIf="viewSyncer.initialDataArrived else notLoaded" */
  viewSyncer ! : ViewSyncer

  tinyMceInit = {
    height: 500,
    menubar: true,
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
    content_css: 'dark',  // > **Note**: This feature is only available for TinyMCE 5.1 and later.
    entity_encoding: `raw`,
    content_style: '[contenteditable] { padding: 5px; }' /* https://www.tiny.cloud/docs/configure/content-appearance/
      to be able to see cursor when it's close to focus border */,
    setup: (editor: any) => {
      editor.addShortcut(
        'meta+e', 'Add yellow highlight to selected text.', () => {
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
    editor.execCommand('hilitecolor', false, '#808000');
  }

  constructor() { }

  ngOnInit() {
    if ( this.side ) {
      this.formControls = this.createFormControlDict()
      this.formGroup = new FormGroup(this.formControls)
      this.viewSyncer = new ViewSyncer(this.formGroup, this.item$, true) /* TODO might need to ignore other fields from db */
    }
  }

  private createFormControlDict(): FormControlsDict {
    const ret = {} as FormControlsDict
    ret[this.side !. id] = new FormControl()
    // console.dir(ret)
    return ret
  }

  logEditor(msg: string) {
    debugLog(`tinymce: `, msg)
  }
}
