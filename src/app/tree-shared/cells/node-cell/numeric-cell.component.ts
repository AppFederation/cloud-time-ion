import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CellComponent } from '../CellComponent'
import {
  NodeFocusOptions,
  OryTreeNode,
} from '../../../tree-model/TreeModel'
import {
  setCaretPosition,
} from '../../../utils/utils'

/* TODO: rename to eg NumericCell */
@Component({
  selector: 'app-node-cell',
  templateUrl: './numeric-cell.component.html',
  styleUrls: ['./numeric-cell.component.sass']
})
export class NumericCellComponent extends CellComponent implements OnInit, CellComponent {

  // @Input()
  get showCalculatedValue() { return this.treeNode.showEffectiveValue(this.column) }

  // @Input()
  get calculatedValue() { return this.treeNode.effectiveDurationText(this.column) }

  // @Input()
  get isDanger() {
    return this.treeNode.isChildrenEstimationExceedingOwn(this.column)
  }

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

  focus(options?: NodeFocusOptions) {
    setCaretPosition(this.nativeElement, options && options.cursorPosition)
  }
}
