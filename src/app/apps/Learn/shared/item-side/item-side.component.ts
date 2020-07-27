import {Component, Input, OnInit} from '@angular/core';
import {LearnItem$} from '../../models/LearnItem'
import {Side} from '../../core/sidesDefs'
import {ViewSyncer} from '../../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {FormControl, FormGroup} from '@angular/forms'

export type FormControlsDict = {[key: string]: FormControl /* TODO: mapped type */}

@Component({
  selector: 'app-item-side-editor',
  templateUrl: './item-side.component.html',
  styleUrls: ['./item-side.component.sass'],
})
export class ItemSideComponent implements OnInit {

  @Input() item$ ! : LearnItem$

  @Input() side ! : Side

  formControls ! : FormControlsDict

  formGroup ! : FormGroup


  /** TODO     *ngIf="viewSyncer.initialDataArrived else notLoaded" */
  viewSyncer ! : ViewSyncer

  tinyMceInit = {
    height: 500,
    menubar: true,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    toolbar:
      'undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | help',
    skin: 'oxide-dark',
    content_css: 'dark',  // > **Note**: This feature is only available for TinyMCE 5.1 and later.
    entity_encoding: `raw`,
  }

  constructor() { }

  ngOnInit() {
    this.formControls = this.createFormControlDict()
    this.formGroup = new FormGroup(this.formControls)
    this.viewSyncer = new ViewSyncer(this.formGroup, this.item$) /* TODO might need to ignore other fields from db */
  }

  private createFormControlDict(): FormControlsDict {
    const ret = {} as FormControlsDict
    ret[this.side.id] = new FormControl()
    // console.dir(ret)
    return ret
  }
}
