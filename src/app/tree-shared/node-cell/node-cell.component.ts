import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NodeContentComponent } from '../node-content/node-content.component'
import { OryColumn } from '../OryColumn'
import { ColumnCell } from '../node-content/Cells'

/* TODO: rename to eg NumericCell */
@Component({
  selector: 'app-node-cell',
  templateUrl: './node-cell.component.html',
  styleUrls: ['./node-cell.component.scss']
})
export class NodeCellComponent implements OnInit {

  /** TODO fix circular dep via e.g. event */
  @Input()
  nodeContentComponent: NodeContentComponent

  @Input()
  cell: ColumnCell

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


  constructor() { }

  ngOnInit() {
    this.nativeElement = this.cellInput.nativeElement
    this.nativeElement.addEventListener('input', (ev) => this.onInputChanged(ev));
    this.nodeContentComponent.mapColumnToComponent.set(this.cell.column, this)
  }

  private onInputChanged(event: any) {
    this.nodeContentComponent.onInputChanged(event, this.cell.column)
    return this.cellInputChanged.emit(event);
  }

  getInputValue(): string {
    return this.cellInput.nativeElement.value
  }

  setInputValue(newValue: string) {
    this.cellInput.nativeElement.value = newValue || ''
  }

  inputValueEquals(newValue: string) {
    return this.getInputValue() === newValue
  }

  onArrowRight() {

  }
}
