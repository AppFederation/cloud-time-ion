import {
  ElementRef,
  HostListener,
  Injectable,
  Injector,
  Input,
  OnInit,
} from '@angular/core'
import { ColumnCell } from '../node-content/Cells'
import { NodeContentComponent } from '../node-content/node-content.component'
import {
  NodeFocusOptions,
  OryTreeNode,
} from '../../tree-model/TreeModel'

export abstract class CellComponent implements OnInit {

  /** TODO fix circular dep via e.g. event / ViewModel */
  @Input()
  nodeContentComponent: NodeContentComponent

  @Input()
  cell: ColumnCell

  get column() { return this.cell.column }

  get treeNode() { return this.cell.treeNode }


  abstract getInputValue(): string

  abstract setInputValue(newValue: string)

  constructor(
    // protected injector: Injector,
  ) {}

  inputValueEquals(newValue: string) {
    return this.getInputValue() === newValue
  }

  protected onInputChanged(event, newValue) {
    this.nodeContentComponent.onInputChanged(event, this.cell, newValue, this)
  }

  abstract focus(options?: NodeFocusOptions)

  ngOnInit() {
    this.nodeContentComponent.mapColumnToComponent.set(this.cell.column, this)
    // console.log(this.injector.get(ElementRef))
  }

  @HostListener('focusin', ['$event'])
  onFocusIn() {
    this.nodeContentComponent.onColumnFocused(this.column, null)
  }
}
