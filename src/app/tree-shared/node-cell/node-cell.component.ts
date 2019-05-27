import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

/* TODO: rename to eg NumericCell */
@Component({
  selector: 'app-node-cell',
  templateUrl: './node-cell.component.html',
  styleUrls: ['./node-cell.component.scss']
})
export class NodeCellComponent implements OnInit {

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
  }

  private onInputChanged(ev: any) {
    return this.cellInputChanged.emit(ev);
  }

  getInputValue(): string {
    return this.cellInput.nativeElement.value
  }

  setInputValue(newValue: string) {
    this.cellInput.nativeElement.value = newValue
  }

  inputValueEquals(newValue: string) {
    return this.getInputValue() === newValue
  }
}
