import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CellComponent } from '../CellComponent'
import { NodeContentComponent } from '../../node-content/node-content.component'
import { ColumnCell } from '../../node-content/Cells'
import { NodeFocusOptions } from '../../../tree-model/TreeModel'
import { debugLog } from '../../../utils/log'
import {setCaretOnContentEditable} from '../../../../../libs/AppFedShared/utils/utils-from-oryol'
import {nullish} from '../../../../../libs/AppFedShared/utils/type-utils'

@Component({
  selector: 'app-contenteditable-cell',
  templateUrl: './contenteditable-cell.component.html',
  styleUrls: ['./contenteditable-cell.component.sass'],
})
export class ContenteditableCellComponent extends CellComponent implements OnInit {

  /** TODO fix circular dep via e.g. event */
  // @Input()
  // nodeContentComponent!: NodeContentComponent
  //
  // @Input()
  // cell!: ColumnCell

  @ViewChild('contentEditableEl', {static: true}) contentEditableEl!: ElementRef

  public lastSetInputValue!: string

  constructor() {
    console.log('ContenteditableCellComponent ctor')
    super()
  }

  override ngOnInit() {
    super.ngOnInit()
    this.contentEditableEl.nativeElement.addEventListener(
      'input',
      (event: InputEvent) =>
        this.onInputChanged(event, this.getInputValue())
    )
  }

  getInputValue(): string {
    const innerHTML = this.contentEditableEl.nativeElement.innerHTML
    console.log(`ContenteditableCellComponent getInputValue: [[[${innerHTML}]]]`, `lastSetInputValue: [${this.lastSetInputValue}]`)
    // return this.lastSetInputValue // FIXME this causes value to not get applied to contentEditable; hypothesis: maybe it gets applied before the HTML element is initialized?
    return innerHTML
  }

  setInputValue(newValue: string) {
    this.lastSetInputValue = newValue
    // debugLog('contenteditable setInputValue', newValue)
    debugLog('ContenteditableCellComponent setInputValue', newValue)
    console.log('ContenteditableCellComponent setInputValue', newValue)
    this.contentEditableEl.nativeElement.innerHTML = newValue
  }

  focus(options?: NodeFocusOptions | nullish) {
    // const err = new Error();
    // console.log('ContenteditableCellComponent focus', options, err.stack)
    setTimeout(() => {
      const nativeElement = this.contentEditableEl.nativeElement
      if ( window.document.activeElement !== nativeElement ) {
        // ^ check if it had focus, to prevent ruining text caret position
        nativeElement.focus()
        setCaretOnContentEditable(
          nativeElement, (options?.cursorPosition ?? -1) >= 0 /* simplification of start vs end*/
        )
      }
    })
    // this.contentEditableEl.nativeElement.scrollIntoView()
  }

}
