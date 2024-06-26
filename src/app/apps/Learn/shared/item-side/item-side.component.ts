import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Side, sidesDefs, SidesDefs} from '../../core/sidesDefs'
import {ViewSyncer} from '../../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms'
import {nullish} from '../../../../libs/AppFedShared/utils/type-utils'
import {LearnItem$} from '../../models/LearnItem$'
import {debugLog} from '../../../../libs/AppFedShared/utils/log'
import {LearnItem} from '../../models/LearnItem'
import {RichTextEditComponent} from '../../../../libs/AppFedShared/rich-text/rich-text-edit/rich-text-edit.component'
import {OdmCell} from '../../../../libs/AppFedShared/tree/cells/OdmCell'

export type SideFormControlsDict = {[key in keyof SidesDefs]: UntypedFormControl }


// TODO: escape key to hide toolbar&menu bar
@Component({
  selector: 'app-item-side-editor',
  templateUrl: './item-side.component.html',
  styleUrls: ['./item-side.component.sass'],
})
export class ItemSideComponent implements OnInit {

  answerDescr = sidesDefs.answer


  @Input()
  item$ ! : LearnItem$

  /** TODO: this should use OdmCell (maybe subclass like ItemSideCell); and this expandable icon-to-editor functionality could be useful also in treetable node cell */
  @Input()
  side ! : Side | nullish

  @Input()
  cell ! : OdmCell

  @Input()
  showRevealButton = false


  formControls ! : SideFormControlsDict

  formGroup ! : UntypedFormGroup

  editorOpened = false

  @ViewChild(RichTextEditComponent)
  editorViewChild ! : RichTextEditComponent


  get formControl() {
    return this.formControls[this.side!.id]
  }

  /** TODO     *ngIf="viewSyncer.initialDataArrived else notLoaded" */
  viewSyncer ! : ViewSyncer


  constructor() { }

  ngOnInit() {
    if ( this.side ) {
      this.formControls = this.createFormControlDict()
      this.formGroup = new UntypedFormGroup(this.formControls)
      this.viewSyncer = new ViewSyncer(
        this.formGroup,
        this.item$,
        true,
        this.side !. id as keyof LearnItem
      ) /* TODO might need to ignore other fields from db */
    }
  }

  private createFormControlDict(): SideFormControlsDict {
    const ret = {} as SideFormControlsDict
    ret[this.side !. id] = new UntypedFormControl()
    // console.dir(ret)
    return ret
  }

  logEditor(msg: string) {
    debugLog(`tinymce: `, msg)
  }

  focusEditor() {
    setTimeout(() => {
      // debugLog(`focusEditor`, this.editorViewChild)
      this.editorViewChild ?. focusEditor()
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

  isVisible(item: LearnItem | nullish): boolean {
    if ( ! item ) {
      return false
    }
    if ( this.side ?. hideByDefault ) {
      return false
    }
    if ( item.isTask && ! item.isToLearn ) {
      return ! this.side?.onlyForLearn
    }
    return true
  }

}
