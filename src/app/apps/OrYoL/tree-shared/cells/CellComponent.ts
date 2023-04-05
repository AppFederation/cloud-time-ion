import {
  Component,
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
import {nullish} from '../../../../libs/AppFedShared/utils/type-utils'

@Component({
  selector: 'zzz-app-abstract-node-cell',
  template: '',
  styleUrls: []
})
export abstract class CellComponent implements OnInit {

  /** TODO fix circular dep via e.g. event / ViewModel */
  @Input()
  nodeContentComponent!: NodeContentComponent

  @Input()
  cell!: ColumnCell

  get column() { return this.cell.column }

  get treeNode() { return this.cell.treeNode }


  abstract getInputValue(): string

  abstract setInputValue(newValue: string): void

  constructor(
    // protected injector: Injector,
  ) {}

  inputValueEquals(newValue: string) {
    return this.getInputValue() === newValue
  }

  protected onInputChanged(event: any, newValue: any) {
    this.nodeContentComponent.onInputChanged(event, this.cell, newValue, this)
    /// FIXME this should not go to parent component; instead to OdmItem$ or similar model obj
  }

  abstract focus(options?: NodeFocusOptions | nullish): void

  ngOnInit() {
    this.nodeContentComponent.mapColumnToComponent.set(this.cell.column, this)
    // console.log(this.injector.get(ElementRef))
  }

  @HostListener('focusin', ['$event'])
  onFocusIn() {
    this.nodeContentComponent.onColumnFocused(this.column, null)
  }
}
