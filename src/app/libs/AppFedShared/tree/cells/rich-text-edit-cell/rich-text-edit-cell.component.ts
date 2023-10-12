import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {OdmCell} from '../OdmCell'
import {CellNavigationService} from '../../../cell-navigation.service'
import {FormControl, UntypedFormControl} from '@angular/forms'
import {RichTextEditComponent} from '../../../rich-text/rich-text-edit/rich-text-edit.component'
import {CellComponent} from '../../../../../apps/OrYoL/tree-shared/cells/CellComponent'
import {errorAlert} from '../../../utils/log'

@Component({
  selector: 'app-rich-text-edit-cell',
  templateUrl: './rich-text-edit-cell.component.html',
  styleUrls: ['./rich-text-edit-cell.component.sass'],
})
export class RichTextEditCellComponent /*extends CellComponent*/ implements OnInit {

  /** TODO use RichTextEditComponent.
   * Later the fancy component could be activated on-demand by some 3-dots menu button or edit icon
   * Pass FormControl
   * */
  @ViewChild('contentEditableEl', {static: true})
  contentEditableEl !: ElementRef

  @ViewChild(RichTextEditComponent, {static: true})
  richTextEditComponent !: RichTextEditComponent

  @Input()
  cell !: OdmCell

  formControl!: FormControl

  constructor(
    public cellNavigationService: CellNavigationService
  ) {
    // super()
  }

  /*override */ngOnInit() {
    // super.onInit()
    // this.contentEditableEl
    //   .nativeElement.addEventListener('input', (event: any) => this.onInputChanged(event, this.getInputValue()))

    this.formControl = new UntypedFormControl()
    this.formControl.setValue(this.cell.patchableObservable.locallyVisibleChanges$.lastVal)
    console.error(`FIXME RichTextEditCellComponent should react to external changes from DB / UI`)
    this.formControl.valueChanges.subscribe(val => {
      this.cell.patchThrottled(val)
    })
  }

  /*override */ onInputChanged(event: any, newValue: any) {
    console.log('onInputChanged', newValue)
    this.cell.patchThrottled(newValue, event)
  }

  /*override */getInputValue(): string {
    return this.contentEditableEl.nativeElement.innerHTML
  }

  /*override */ focus() {
    this.richTextEditComponent.focusEditor()
  }

  /*override */ setInputValue(newValue: string): void {
    errorAlert('setInputValue not implemented; do i still need it?')
  }

}
