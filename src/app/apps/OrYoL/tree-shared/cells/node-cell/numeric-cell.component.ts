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
import {Config, ConfigService} from '../../../core/config.service'
import {setCaretPosition} from '../../../../../libs/AppFedShared/utils/utils-from-oryol'
import {nullish} from '../../../../../libs/AppFedShared/utils/type-utils'
import {CachedSubject} from '../../../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'

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
  isDanger() {
    return this.treeNode.isChildrenEstimationExceedingOwn(this.column)
  }

  @ViewChild('cellInput', {static: true})
  cellInput!: ElementRef

  @Output()
  cellInputChanged = new EventEmitter()

  /* for interim compatibility after extracting this component */
  nativeElement!: HTMLElement

  config$: CachedSubject<Config> = this.configService.config$

  constructor(
    public configService: ConfigService,
  ) {
    super()
  }

  override ngOnInit() {
    super.ngOnInit()
    this.nativeElement = this.cellInput.nativeElement
    this.nativeElement.addEventListener('input', (ev) => this.emitInputChanged(ev)); // TODO unsubscribe
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

  focus(options?: NodeFocusOptions | nullish) {
    this.nativeElement.focus()
    setCaretPosition(this.nativeElement, options ?. cursorPosition)
  }
}
