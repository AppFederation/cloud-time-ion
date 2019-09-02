import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NodeContentComponent } from '../../node-content/node-content.component'
import { OryColumn } from '../../OryColumn'
import { ColumnCell } from '../../node-content/Cells'
import { CellComponent } from '../CellComponent'
import { NodeFocusOptions } from '../../../tree-model/TreeModel'
import {
  setCaretOnContentEditable,
  setCaretPosition,
} from '../../../utils/utils'

/* TODO: rename to eg NumericCell */
@Component({
  selector: 'app-node-cell',
  templateUrl: './numeric-cell.component.html',
  styleUrls: ['./numeric-cell.component.scss']
})
export class NumericCellComponent extends CellComponent implements OnInit, CellComponent {

  @Input()
  showCalculatedValue: boolean

  @Input()
  calculatedValue = ''

  @Input()
  isDanger = false

  @ViewChild('cellInput')
  cellInput: ElementRef

  @Output()
  cellInputChanged = new EventEmitter()

  /* for interim compatibility after extracting this component */
  nativeElement: any


  constructor() {
    super()
  }

  ngOnInit() {
    super.ngOnInit()
    this.nativeElement = this.cellInput.nativeElement
    this.nativeElement.addEventListener('input', (ev) => this.emitInputChanged(ev));
  }

  private emitInputChanged(event: any) {
    this.onInputChanged(event, event.target.value)
    return this.cellInputChanged.emit(event);
  }

  getInputValue(): string {
    return this.cellInput.nativeElement.value
  }

  setInputValue(newValue: string) {
    this.cellInput.nativeElement.value = newValue || ''
  }

  onArrowRight() {

  }

  focus(options?: NodeFocusOptions) {
    setCaretPosition(this.nativeElement, options && options.cursorPosition)
  }
}
