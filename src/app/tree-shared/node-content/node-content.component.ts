import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  NodeFocusOptions,
  OryTreeNode,
} from '../../tree-model/TreeModel'
import { TreeHostComponent } from '../../tree-host/tree-host/tree-host.component'
import { OryColumn } from '../OryColumn'
import { DbTreeService } from '../../tree-model/db-tree-service'
import { DomSanitizer } from '@angular/platform-browser'
import { isNullOrUndefined } from 'util'
import { DialogService } from '../../core/dialog.service'
// import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';

import { padStart } from 'lodash';
import { DebugService } from '../../core/debug.service'

import 'hammerjs';
import { debugLog } from '../../utils/log'
import {
  NgbModal,
  NgbPopoverConfig,
} from '@ng-bootstrap/ng-bootstrap'
import { NumericCellComponent } from '../cells/node-cell/numeric-cell.component'
import {
  setCaretOnContentEditable,
  setCaretPosition,
} from '../../utils/utils'
import {
  getActiveElementCaretPos,
  getCaretPosition,
  getSelectionCursorState,
  isCaretAtEndOfActiveElement,
} from '../../utils/caret-utils'
import { ConfirmDeleteTreeNodeComponent } from '../confirm-delete-tree-node/confirm-delete-tree-node.component'
import {
  Cells,
  ColumnCell,
} from './Cells'
import { CellComponent } from '../cells/CellComponent'

/* ==== Note there are those sources of truth kind-of (for justified reasons) :
* - UI state
* - tree model: treeNode.itemData & treeNode's nodeInclusionData
* - tree model / view-model events, e.g. fireOnChangeItemDataOfChildOnParents()
* (those above could probably be always 100% in sync; although might be throttleTime-d eg. 100ms if complex calculations and updating dependent nodes)
* - firestore (sent-to-firestore, received-from-firestore)
*/


/* Consider renaming to "view slots" - more generic than columns, while more view-related than "property".
 * Or maybe PropertyView ? */
export class Columns {
  title = new OryColumn('title')
  estimatedTimeMin = new OryColumn('estimatedTimeMin')
  estimatedTime = new OryColumn('estimatedTime')
  estimatedTimeMax = new OryColumn('estimatedTimeMax')
  isDone = new OryColumn('isDone')
  allColumns = [
    this.title,
    this.estimatedTimeMin,
    this.estimatedTime,
    this.estimatedTimeMax,
    this.isDone,
  ]
  lastColumn = this.title
  leftMostColumn = this.estimatedTime

  createColumnCells() {
    const cells = new Cells()
    this.allColumns.forEach(column => {
      new ColumnCell(column, cells)
    })
    return cells
  }
}

@Component({
  selector: 'app-node-content',
  templateUrl: './node-content.component.html',
  styleUrls: ['./node-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgbPopoverConfig],
})
export class NodeContentComponent implements OnInit, AfterViewInit, OnDestroy {

  static columnsStatic = new Columns()

  columns: Columns = NodeContentComponent.columnsStatic
  cells = this.columns.createColumnCells()

  isDone: boolean = false

  @Input() treeNode: OryTreeNode

  @Input() treeHost: TreeHostComponent

  // @ViewChild('inputEstimatedTime') elInputEstimatedTime: NodeCellComponent

  // nodeIndex = 0
  private focusedColumn: OryColumn

  // isApplyingFromDbNow = false
  mapColumnToComponent = new Map<OryColumn, CellComponent>()

  editedHere = new Map<OryColumn, boolean>()
  lastEditedLocallyByColumn = new Map<OryColumn, Date>()
  private mapColumnToEventEmitterOnChange = new Map<OryColumn, EventEmitter<any>>()
  isAncestorOfFocused = false
  isDestroyed = false
  private pendingThrottledItemDataPatch = {}

  get isEstimatedTimeShown() {
    return ! this.treeNode.isChildOfRoot // FIXME
    // return this.treeNode.hasField(this.columns.estimatedTime)
  }

  debug = new class Debug {
    countApplyItemDataValuesToViews = 0
  } ()

  get estimatedTime() {
    return this.treeNode.itemData.estimatedTime
  }


  constructor(
    public dbService: DbTreeService,
    public sanitizer: DomSanitizer,
    public dialogService: DialogService,
    private changeDetectorRef: ChangeDetectorRef,
    public debugService: DebugService,
    private modalService: NgbModal,
    config: NgbPopoverConfig,
  ) {
    // config.placement = 'right';
    config.placement = 'auto';
    // config.triggers = 'hover';
  }

  ngOnInit() {
    debugLog('ngOnInit', this.treeNode.nodeInclusion)
    // this.nodeIndex = this.treeNode.getIndexInParent()
    this.treeHost.registerNodeComponent(this)

    // this.initialTitle = this.treeNode.itemData.title /* note: shortcut that I took: not yet updating title in realtime
    // */
    // NEXT: enable real time updates of title - perhaps check if new value === existing, perhaps use isApplyingFromDbNow
    // WHY: 1. my mind is already in the topic; cementing it would be good
    // WHY: 2. it can lead to data loss if I go to another window/device and accidentally edit something that was changed elsewhere
    // this.elInputTitle.nativeElement.innerHTML = this.sanitizer.bypassSecurityTrustHtml(this.initialTitle);
    // this.elInputTitle.nativeElement.innerHTML = this.initialTitle;
    // this.estimatedTimeModel = this.treeNode.itemData.estimatedTime
    // this.elInputEstimatedTime.nativeElement.value = this.estimatedTimeModel;

    this.applyItemDataValuesToViews()

    // here also react to child nodes to recalculate sum
    const onChangeItemDataOrChildHandler = () => {
      debugLog('onChangeItemDataOrChildHandler')
      if ( ! this.isDestroyed ) {
        this.applyItemDataValuesToViews()
      }
    }
    this.treeNode.onChangeItemData.subscribe(onChangeItemDataOrChildHandler)
    this.treeNode.onChangeItemDataOfChild.subscribe(onChangeItemDataOrChildHandler)

    this.subscribeDebouncedOnChangePerColumns()
    this.treeNode.treeModel.focus.focus$.subscribe(() => {
      if (!this.isDestroyed) {
        this.isAncestorOfFocused = this.treeNode.highlight.isAncestorOfFocusedNode()
        // console.log('isAncestorOfFocused', this.isAncestorOfFocused)
        this.changeDetectorRef.detectChanges()
      }
    })

  }

  private applyItemDataValuesToViews() {
    this.debug.countApplyItemDataValuesToViews ++
    debugLog('applyItemDataValuesToViews this.treeNode', this.treeNode)
    { // estimated time:
      let newValue = this.treeNode.itemData.estimatedTime
      if (newValue === undefined || newValue === null) {
        newValue = ''
      }
      debugLog('newEstimatedTime, ', newValue)

      const column = this.columns.estimatedTime
      // FIXME: take care of the inputValueEquals -- editedHere -- canApplyDataToViewGivenColumnLocalEdits
      // if (this.elInputEstimatedTime.inputValueEquals(newValue)) {
      //   this.editedHere.set(column, false)
      // } else {
      //   if ( this.canApplyDataToViewGivenColumnLocalEdits(column) ) {
      //     this.elInputEstimatedTime.setInputValue(newValue)
      //     // FIXME: note, this should also take focus into account
      //     // --> evolved to the when-last-edited idea
      //   }
      // }
    }

    this.isDone = this.treeNode.itemData.isDone // TODO: remove redundant field in favor of single source of truth
    if (isNullOrUndefined(this.isDone)) {
      this.isDone = false;
    }

    this.changeDetectorRef.detectChanges()
  }

  ngAfterViewInit(): void {

    for ( let entry of this.mapColumnToComponent.entries() ) {
      // maybe call applyItemDataValuesToViews instead and move the loop to applyItemDataValuesToViews
      // FIXME: extract and call also incoming subsequent changes
      // FIXME: take care of the inputValueEquals -- editedHere -- canApplyDataToViewGivenColumnLocalEdits
      const col = entry[0], component = entry[1]
      const fieldVal = col.getValueFromItemData(this.treeNode.itemData)
      component.setInputValue(fieldVal)
    }

    // focus if expecting to focus
    // this.focus()
  }

  addChild() {
    const newTreeNode = this.treeNode.addChild()
    this.treeNode.expanded = true
    this.focusNewlyCreatedNode(newTreeNode)
    // this.addChildToDb()
  }

  private focusNewlyCreatedNode(newTreeNode: OryTreeNode) {
    setTimeout(() => {
      this.treeHost.focusNode(newTreeNode)
    })
  }

  keyPressEnter(event) {
    if ( this.treeNode.isVisualRoot ) {
      this.addChild()
    } else {
      debugLog('key press enter; node: ', this.treeNode)
      event.preventDefault()
      const newTreeNode = this.addNodeAfterThis()
      this.focusNewlyCreatedNode(newTreeNode)
    }
  }

  keyPressMetaEnter(event) {
    debugLog('keyPressMetaEnter')
    this.isDone = !this.isDone
    this.onInputChanged(null, this.cells.mapColumnToCell.get(this.columns.isDone), this.isDone, null)
    this.focusNodeBelow()
  }

  addNodeAfterThis() {
    return this.treeNode.addSiblingAfterThis()
  }

  focusNodeAboveAtEnd() {
    const nodeToFocus = this.treeNode.getNodeVisuallyAboveThis()
    this.treeHost.focusNode(nodeToFocus, this.columns.lastColumn, {cursorPosition: -1})
  }

  focusNodeBelowAtBeginningOfLine() {
    const nodeToFocus = this.treeNode.getNodeVisuallyBelowThis()
    this.treeHost.focusNode(nodeToFocus, this.columns.leftMostColumn, {cursorPosition: 0})
  }

  public focusNodeAbove() {
    const nodeToFocus = this.treeNode.getNodeVisuallyAboveThis()
    this.focusOtherNode(nodeToFocus)
  }

  public focusNodeBelow() {
    const nodeToFocus = this.treeNode.getNodeVisuallyBelowThis()
    this.focusOtherNode(nodeToFocus)
  }

  focusToEstimatedTime() {
    // const ret = getSelectionCursorState(this.elInputTitle.nativeElement)
    // const isStart = ret.atStart
    // const isStart = getCaretPosition(this.elInputTitle.nativeElement) === 0
    // if (isStart) {
    //   this.focus(this.columns.estimatedTime)
    // }
  }

  focusToDescription() {
    // if (isCaretAtEndOfActiveElement()) {
      this.focus(this.columns.title)
    // }
  }

  focusOtherNode(nodeToFocus: OryTreeNode) {
    debugLog('focusOtherNode this.focusedColumn', this.focusedColumn)
    this.treeHost.focusNode(nodeToFocus, this.focusedColumn)
  }

  focus(column?: OryColumn, options?: NodeFocusOptions) {
    let componentToFocus = this.getComponentOrElementByColumnOrDefault(column)
    componentToFocus && componentToFocus.focus(options)
  }

  getComponentOrElementByColumnOrDefault(column?: OryColumn): CellComponent {
    return this.mapColumnToComponent.get(column)
      || this.mapColumnToComponent.get(this.columns.title)
    // if (column === this.columns.estimatedTime) {
    //   return this.elInputEstimatedTime
    // } else {
    //   return this.elInputTitle
    // }
  }

  onColumnFocused(column: OryColumn, event) {
    debugLog('onColumnFocused', column)
    this.focusedColumn = column
    this.treeHost.treeModel.focus.ensureNodeVisibleAndFocusIt(this.treeNode, column)
  }

  /* TODO: rename reactToInputChangedAndSave */
  onInputChanged(event, cell: ColumnCell, newValue, component: CellComponent) {
    debugLog('onInputChanged, cell', cell, event, component)
    const column = cell.column
    this.editedHere.set(column, true)
    this.lastEditedLocallyByColumn.set(column, new Date())
    const inputNewValue = newValue // event.target.value
    column.setValueOnItemData(this.treeNode.itemData, inputNewValue)
    column.setValueOnItemData(this.pendingThrottledItemDataPatch, inputNewValue)
    // this.setTreeNodeItemDataFromUi()
    this.getEventEmitterOnChangePerColumn(column).emit(column)
    // this.treeNode.itemData.buildItemDataFromUi
    // note: the applying from UI to model&events could be throttleTime()-d to e.g. 100-200ms to not overwhelm when typing fast
    this.treeNode.fireOnChangeItemDataOfChildOnParents()
    this.treeNode.onChangeItemData.emit()
    // TODO: investigating time recalculation
  }

  reorderUp(event) {
    event.preventDefault() // for Firefox causing page up/down; same for Safari and TextEdit, so looks like Chrome is lacking this shortcut
    this.treeNode.reorderUp()
  }

  reorderDown(event) {
    event.preventDefault() // for Firefox causing page up/down; same for Safari and TextEdit, so looks like Chrome is lacking this shortcut
    this.treeNode.reorderDown()
  }

  private getEventEmitterOnChangePerColumn(column: OryColumn) {
    let eventEmitter = this.mapColumnToEventEmitterOnChange.get(column)
    if ( ! eventEmitter ) {
      eventEmitter = new EventEmitter()
      this.mapColumnToEventEmitterOnChange.set(column, eventEmitter)
    }
    return eventEmitter
  }

  private subscribeDebouncedOnChangePerColumns() {
    for ( const column of this.columns.allColumns ) {
      this.getEventEmitterOnChangePerColumn(column).throttleTime(
        4000 /* 500ms almost real-time feeling without overwhelming firestore.
        Perhaps Firestore has "SLA" of around 1second latency anyway (I recall reading something like that,
        where they contrasted the latency with Firebase Realtime DB.
        At 500ms Firefox seems to be lagging behind like even up to 3 seconds after finishing typing.
        2018-11-27 23:14 Increased from 1000 to 4000ms after problem with cursor position reset returned */,
        undefined, {
          leading: true /* probably thanks to this, the first change, of a series, is immediate (observed experimentally) */,
            /* think about false; usually single character; but what if someone pastes something, then it will be fast;
            plus a single character can give good indication that someone started writing */
          trailing: true /* ensures last value is not lost;
            http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-throttleTime */
        }
      ).subscribe((changeEvent) => {
        debugLog('onInputChanged; isApplyingFromDbNow', this.treeNode.treeModel.isApplyingFromDbNow)
        if (!this.treeNode.treeModel.isApplyingFromDbNow) {
          // const itemData = this.buildItemDataFromUi()
          this.treeNode.patchItemData(this.pendingThrottledItemDataPatch)
          this.pendingThrottledItemDataPatch = {}
        } // else: no need to react, since it is being applied from Db
      })
    }
  }

  // private setTreeNodeItemDataFromUi() {
  //   this.treeNode.itemData = this.buildItemDataFromUi()
  // }
  //
  // private buildItemDataFromUi() {
  //   // TODO: later this will be incremental diff in NodeContentViewSyncer /
  //   const titleVal = this.elInputTitle.nativeElement.innerHTML
  //   const estimatedTimeVal = this.elInputEstimatedTime.nativeElement.value
  //   // console.log('input val: ' + titleVal)
  //   const itemData = {
  //     title: titleVal,
  //     estimatedTime: estimatedTimeVal,
  //     isDone: this.isDone,
  //     itemClass: 'task' /* FIXME */,
  //   }
  //   return itemData
  // }

  ngOnDestroy(): void {
    this.isDestroyed = true
  }

  formatEndTime() {
    const date = this.treeNode.endTime()
    return '' + date.getHours() + ':' + padStart('' + date.getMinutes(), 2, '0')
  }

  toggleExpand(event) {
    debugLog('toggleExpand', event)
    this.treeNode.expansion.toggleExpansion(event.altKey)
  }

  onPress(event) {
    // window.alert('onPress')
    console.log('onPress')
    this.treeNode.expansion.toggleExpansion(true)
  }

  private canApplyDataToViewGivenColumnLocalEdits(column: OryColumn) {
    return !this.editedHere.get(column)
      && this.canApplyDataToViewGivenColumnLastLocalEdit(column)
  }

  private canApplyDataToViewGivenColumnLastLocalEdit(column: OryColumn) {
    const lastEditedByColumn = this.lastEditedLocallyByColumn.get(column)
    if ( ! lastEditedByColumn ) {
      return true
    } else {
      const timeNow = new Date().getTime() /* milliseconds since 1970/01/01 */
      // can only apply incoming changes to view if at least N seconds passed since last local edit
      return (timeNow - lastEditedByColumn.getTime()) > 5000
    }
  }

  navigateInto() {
    this.treeNode.navigateInto()
  }

  indentDecrease($event) {
    $event.preventDefault()
    this.treeNode.indentDecrease()
    this.focusNewlyCreatedNode(this.treeNode) // FIXME this will not work correctly when multi-parents get fully implemented
  }

  indentIncrease($event) {
    $event.preventDefault()
    this.treeNode.indentIncrease()
    this.focusNewlyCreatedNode(this.treeNode) // FIXME this will not work correctly when multi-parents get fully implemented
  }

  onArrowLeftOnLeftMostCell() {
    if ( getActiveElementCaretPos() === 0 ) {
      this.focusNodeAboveAtEnd()
    }
  }

  onArrowRightOnRightMostCell() {
    // if ( getActiveElementCaretPos() === 0 ) {
    this.focusNodeBelowAtBeginningOfLine()
    // }
  }

  onKeyDownBackspaceOnEstimatedTime() {
    if ( getActiveElementCaretPos() === 0
      && this.treeNode.itemData.estimatedTime === ''
    ) {
      this.openDeleteDialog()
    }
  }

  onKeyDownBackspaceOnTitle() {
    // if (getCaretPosition(this.elInputTitle.nativeElement) === 0
    //   && this.treeNode.itemData.title === ''
    // ) {
    //   this.openDeleteDialog()
    // }
  }

  private openDeleteDialog() {
    const modalRef = this.modalService.open(ConfirmDeleteTreeNodeComponent);
    const component = modalRef.componentInstance as ConfirmDeleteTreeNodeComponent
    component.treeNode = this.treeNode;
  }

  getIconName() {
    // return this.treeNode.dbItem.itemClass.iconName
    if ( this.treeNode.parent2.isDayPlan) {
      return 'settings_applications'
    }
    if ( this.treeNode.isDayPlan ) {
      return 'calendar_today'
    } else {
      return 'note'
    }
  }

  onCursorMoveKeydown() {
    // if ( getSelectionCursorState(this.elInputTitle.nativeElement).atEnd ) {
    //   this.onArrowRightOnRightMostCell()
    //   console.log('atEnd')
    // }
  }
}
