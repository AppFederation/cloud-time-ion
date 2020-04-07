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
import {
  setCaretOnContentEditable,
  setCaretPosition,
} from '../../../utils/utils'
import { NodeFocusOptions } from '../../../tree-model/TreeModel'
import { debugLog } from '../../../utils/log'

@Component({
  selector: 'app-contenteditable-cell',
  templateUrl: './contenteditable-cell.component.html',
  styleUrls: ['./contenteditable-cell.component.sass'],
})
export class ContenteditableCellComponent extends CellComponent implements OnInit {

  /** TODO fix circular dep via e.g. event */
  @Input()
  nodeContentComponent: NodeContentComponent

  @Input()
  cell: ColumnCell

  @ViewChild('contentEditableEl') contentEditableEl: ElementRef

  constructor() {
    super()
  }

  ngOnInit() {
    super.ngOnInit()
    this.contentEditableEl
      .nativeElement.addEventListener('input', (event) => this.onInputChanged(event, this.getInputValue()))
  }

  getInputValue(): string {
    return this.contentEditableEl.nativeElement.innerHTML
  }

  setInputValue(newValue: string) {
    debugLog('contenteditable setInputValue', newValue)
    this.contentEditableEl.nativeElement.innerHTML = newValue
  }

  focus(options?: NodeFocusOptions) {
    // console.log('ContenteditableCellComponent focus', options)
    setTimeout(() => {
      this.contentEditableEl.nativeElement.focus()
      setCaretOnContentEditable(
        this.contentEditableEl.nativeElement, options && (options.cursorPosition) >= 0 /* simplification of start vs end*/
      )
    })
    // this.contentEditableEl.nativeElement.scrollIntoView()
  }

}
