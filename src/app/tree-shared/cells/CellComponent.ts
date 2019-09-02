import {
  Input,
  OnInit,
} from '@angular/core'
import { ColumnCell } from '../node-content/Cells'
import { NodeContentComponent } from '../node-content/node-content.component'
import { NodeFocusOptions } from '../../tree-model/TreeModel'

export abstract class CellComponent implements OnInit {

  /** TODO fix circular dep via e.g. event */
  @Input()
  nodeContentComponent: NodeContentComponent

  @Input()
  cell: ColumnCell

  abstract getInputValue(): string

  abstract setInputValue(newValue: string)

  inputValueEquals(newValue: string) {
    return this.getInputValue() === newValue
  }

  protected onInputChanged(event, newValue) {
    this.nodeContentComponent.onInputChanged(event, this.cell, newValue, this)
  }

  abstract focus(options?: NodeFocusOptions)

  ngOnInit() {
    this.nodeContentComponent.mapColumnToComponent.set(this.cell.column, this)
  }
}
