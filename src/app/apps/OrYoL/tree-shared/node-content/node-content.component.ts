import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  ApfBaseTreeNode, NodeFocusOptions, OryBaseTreeNode,
} from '../../tree-model/TreeModel'
import { TreeHostComponent } from '../../tree-host/tree-host/tree-host.component'
import { OryColumn } from '../OryColumn'
// import 'rxjs/add/operator/throttleTime';

import { padStart } from 'lodash-es';
import { DebugService } from '../../core/debug.service'

import 'hammerjs';
import { debugLog } from '../../utils/log'
// import {
//   NgbModal,
// } from '@ng-bootstrap/ng-bootstrap'
import { ConfirmDeleteTreeNodeComponent } from '../confirm-delete-tree-node/confirm-delete-tree-node.component'
import {
  Cells,
  ColumnCell,
} from './Cells'
import { CellComponent } from '../cells/CellComponent'
import { NodeContentViewSyncer } from './NodeContentViewSyncer'
import { NodeDebug } from './node-debug-cell/node-debug-cell.component'
import {
  columnDefs,
  Columns,
} from './Columns'
import {Config, ConfigService} from '../../core/config.service'
import { TimeTrackingService } from '../../time-tracking/time-tracking.service'
import {getActiveElementCaretPos, getSelectionCursorState} from '../../../../libs/AppFedShared/utils/caret-utils'
import {isNullish} from '../../../../libs/AppFedShared/utils/utils'
import {nullish} from '../../../../libs/AppFedShared/utils/type-utils'
import {PopoverController} from '@ionic/angular'
import {TreeNodeMenuComponent} from '../tree-node-menu/tree-node-menu.component'
import {INodeContentComponent} from './INodeContentComponent'
import {CachedSubject} from '../../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {OryTreeTableNodeContent} from '../../tree-model/OryTreeTableNodeContent'
import {TreeTableNodeContent} from '../../tree-model/TreeTableNodeContent'
import {ApfNonRootTreeNode} from '../../tree-model/TreeNode'

/* ==== Note there are those sources of truth kind-of (for justified reasons) :
* - UI state
* - tree model: treeNode.itemData & treeNode's nodeInclusionData
* - tree model / view-model events, e.g. fireOnChangeItemDataOfChildOnParents()
* (those above could probably be always 100% in sync; although might be throttleTime-d eg. 100ms if complex calculations and updating dependent nodes)
* - firestore (sent-to-firestore, received-from-firestore)
*/

@Component({
  selector: 'app-node-content',
  templateUrl: './node-content.component.html',
  styleUrls: ['./node-content.component.sass'],
  // encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeContentComponent implements OnInit, AfterViewInit, OnDestroy, INodeContentComponent {

  /** Could be actually map *Cell* to Component */
  mapColumnToComponent = new Map<OryColumn, CellComponent>()

  columnDefs = columnDefs

  /* TODO: move to tree model / column-model */
  static columnsStatic = new Columns()

  columns: Columns = NodeContentComponent.columnsStatic

  cells!: Cells

  /* TODO: remove */
  isDone: Date | boolean /* for backwards compatibility */ | null = null

  nodeContentViewSyncer!: NodeContentViewSyncer

  @Input() treeNode!: OryBaseTreeNode

  @Input() treeHost!: TreeHostComponent

  private focusedColumn: OryColumn | undefined

  isAncestorOfFocused = false

  isDestroyed = false

  public get isFocusAtRightmostColumn() { return this.focusedColumn === this.columns.lastColumn }

  public get isFocusAtLeftmostColumn() { return this.focusedColumn === this.columns.leftMostColumn }

  get isEstimatedTimeShown() {
    return ! this.treeNode.isChildOfRoot // FIXME
    // return this.treeNode.hasField(this.columns.estimatedTime)
  }

  nodeDebug = new NodeDebug()

  config$: CachedSubject<Config> = this.configService.config$

  constructor(
    public timeTrackingService: TimeTrackingService,
    private changeDetectorRef: ChangeDetectorRef,
    public debugService: DebugService,
    // private modalService: NgbModal,
    public configService: ConfigService,
    public popoverController: PopoverController,
    protected injector: Injector,
  ) {
    // should be at the level of model / column-model
    this.config$.subscribe(config => {
      this.columnDefs.estimatedTimeMin.hidden = ! config.showMinMaxColumns
      this.columnDefs.estimatedTimeMax.hidden = ! config.showMinMaxColumns
    })
  }

  ngOnInit() {
    this.cells = this.columns.createColumnCells(this.treeNode) // consider rolling cells into OdmItem$. But prolly not, coz OdmItem$ is not thinking in terms of columns/table/treetable
    // debugLog('ngOnInit', this.treeNode.nodeInclusion)
    // debugLog('ngOnInit NodeContentComponent', this.treeNode)
    this.treeHost.registerNodeComponent(this)

    // here also react to child nodes to recalculate sum
    const onChangeItemDataOrChildHandler = () => {
      debugLog('onChangeItemDataOrChildHandler')
      if ( ! this.isDestroyed ) {
        this.applyItemDataValuesToViews(false)
      }
    }
    this.treeNode.onChangeItemData.subscribe(onChangeItemDataOrChildHandler)
    this.treeNode.onChangeItemDataOfChild.subscribe(onChangeItemDataOrChildHandler)

    this.treeNode.treeModel.focus.focus$.subscribe(() => {
      if (!this.isDestroyed) {
        this.isAncestorOfFocused = this.treeNode.highlight.isAncestorOfFocusedNode()
        // console.log('isAncestorOfFocused', this.isAncestorOfFocused)
        this.changeDetectorRef.detectChanges()
      }
    })
  }

  private applyItemDataValuesToViews(force: boolean) {
    this.nodeDebug.countApplyItemDataValuesToViews ++
    debugLog('applyItemDataValuesToViews this.treeNode', this.treeNode)

    this.isDone = this.treeNode.content.itemData.isDone // TODO: remove redundant field in favor of single source of truth
    if (isNullish(this.isDone)) {
      this.isDone = null; // TODO: test for done timestamp
    }

    this.nodeContentViewSyncer.applyItemDataValuesToViews(force)
    this.changeDetectorRef.detectChanges()
  }

  ngAfterViewInit(): void {
    this.nodeContentViewSyncer = new NodeContentViewSyncer(
      this.injector,
      this.treeNode,
      this.columns,
      this.mapColumnToComponent,
    )
    this.applyItemDataValuesToViews(true /* force = true */)

    // focus if expecting to focus
    // this.focus()
  }

  addChild() {
    const newTreeNode = this.treeNode.addChild() as any as ApfBaseTreeNode
    this.treeNode.expanded = true
    this.focusNewlyCreatedNode(newTreeNode)
  }

  private focusNewlyCreatedNode(newTreeNode: ApfBaseTreeNode) {
    setTimeout(() => {
      this.treeHost.focusNode(newTreeNode)
    })
  }

  keyPressEnter(event: any) {
    if ( this.treeNode.isVisualRoot ) {
      this.addChild()
    } else {
      debugLog('key press enter; node: ', this.treeNode)
      const newTreeNode = this.addNodeAfterThis() as any as ApfBaseTreeNode
      this.focusNewlyCreatedNode(newTreeNode)
    }
    event.preventDefault()
  }

  /** NOTE: time-tracking is a cross-cutting built-in concern, so it's ok for it to spill into some generic code.
   * Though this should later be configurable in keyboard shortcuts settings. (at least on-off to avoid conflicts / accidents)
   *  */
  keyPressMetaEnter(event: any) {
    // debugLog('keyPressMetaEnter')
    const timeTrackedEntry = this.timeTrackingService.obtainEntryForItem(this.treeNode.content)

    // fresh
    // -> (1) being tracked
    // -> done + next row
    // -> was tracked, **not done**
    // -> (1 back) being tracked, not done

    // TODO: move to global command handler? but under new name not toggleDone
    if ( timeTrackedEntry.isTrackingNow ) {
      timeTrackedEntry.pauseOrNoop()
      this.setDone(true) // FIXME this is prolly patching second time
      // timeTrackedEntry.pauseOrNoop()
      this.focusNodeBelow(event)
    } else {
      if ( this.isDone ) {
        this.setDone(false)
      } else {
        timeTrackedEntry.startOrResumeTrackingIfNeeded()
      }
    }

    // if ( timeTrackedEntry.wasTracked /* no longer relevant if it was tracked or not */ ) {
    // } else {
    //   timeTrackedEntry.startOrResumeTrackingIfNeeded()
    // }
  }

  public setDone(newDone: boolean) {
    this.isDone = newDone ? (this.isDone || new Date()) : false // TODO: test for done timestamp
    this.onInputChanged(null, this.cells.mapColumnToCell.get(this.columnDefs.isDone) !, this.isDone, null)
    this.changeDetectorRef.detectChanges()
  }

  addNodeAfterThis() {
    return (this.treeNode as any as ApfNonRootTreeNode).addSiblingAfterThis()
  }

  focusNodeAboveAtEnd() {
    const nodeToFocus: ApfBaseTreeNode | undefined = this.treeNode.getNodeVisuallyAboveThis() as ApfBaseTreeNode | undefined
    this.treeHost.focusNode(nodeToFocus, this.columns.lastColumn, {cursorPosition: -1})
  }

  focusNodeBelowAtBeginningOfLine() {
    const nodeToFocus = this.treeNode.getNodeVisuallyBelowThis() as ApfBaseTreeNode | undefined
    this.treeHost.focusNode(nodeToFocus, this.columns.leftMostColumn, {cursorPosition: 0})
  }

  /** TODO: rename to focusCellAbove */
  public focusNodeAbove($event: any) {
    // if ( getSelectionCursorState().atStart ) {
      const nodeToFocus = this.treeNode.getNodeVisuallyAboveThis() as ApfBaseTreeNode | undefined
      this.focusOtherNode(nodeToFocus)
    // }
  }

  public focusNodeBelow($event: any) {
    // if ( getSelectionCursorState().atEnd ) {
      const nodeToFocus = this.treeNode.getNodeVisuallyBelowThis() as ApfBaseTreeNode | undefined
      this.focusOtherNode(nodeToFocus)
    // }
  }

  focusOtherNode(nodeToFocus: ApfBaseTreeNode | undefined) {
    debugLog('focusOtherNode this.focusedColumn', this.focusedColumn)
    this.treeHost.focusNode(nodeToFocus, this.focusedColumn)
  }

  focus(column?: OryColumn | nullish, options?: NodeFocusOptions | nullish) {
    let cellComponentToFocus = this.getCellComponentByColumnOrDefault(column)
    if ( cellComponentToFocus ) {
      cellComponentToFocus.focus(options)
    }
  }

  getCellComponentByColumnOrDefault(column?: OryColumn | nullish): CellComponent {
    return this.mapColumnToComponent.get(column!)
      || this.mapColumnToComponent.get(this.columnDefs.title) !
  }

  onColumnFocused(column: OryColumn, event: any) {
    debugLog('onColumnFocused', column)
    this.focusedColumn = column
    this.treeHost.treeModel.focus.ensureNodeVisibleAndFocusIt(this.treeNode, column)
  }

  /* TODO: rename reactToInputChangedAndSave
  *
  * FIXME this can probably completely be moved to TreeTableNode
  * only view-related thing is `event
  *
  * */
  onInputChanged(event: any, cell: ColumnCell, inputNewValue: any, component: CellComponent | null) {
    debugLog('onInputChanged, cell', cell, event, component)
    const column = cell.column
    // here start moving responsibilities from component viewSyncer to
// <<<<<<< HEAD
    this.treeNode.content.onInputChangedByUser(cell, inputNewValue)
    column.setValueOnItemData(this.treeNode.content.itemData, inputNewValue) /* FIXME this was changed on `develop`; + patchThrottled considerations */
// =======
//     this.treeNode.onInputChangedByUser(cell, inputNewValue)
//     // column.setValueOnItemData(this.treeNode.itemData, inputNewValue) --- moved to TreeTableNode
// >>>>>>> develop
    // note: the applying from UI to model&events could be throttleTime()-d to e.g. 100-200ms to not overwhelm when typing fast
    this.treeNode.fireOnChangeItemDataOfChildOnParents()
    this.treeNode.onChangeItemData.emit()
    // TODO: investigating time recalculation
  }

  reorderUp(event: any) {
    event.preventDefault() // for Firefox causing page up/down; same for Safari and TextEdit, so looks like Chrome is lacking this shortcut
    ;(this.treeNode as any as ApfNonRootTreeNode).reorderUp()
  }

  reorderDown(event: any) {
    event.preventDefault() // for Firefox causing page up/down; same for Safari and TextEdit, so looks like Chrome is lacking this shortcut
    ;(this.treeNode as any as ApfNonRootTreeNode).reorderDown()
  }

  ngOnDestroy(): void {
    this.isDestroyed = true
    this.treeHost.onNodeContentComponentDestroyed(this)
  }

  /* TODO: move to end-time cell (only on day-plans) */
  formatEndTime(column: OryColumn) {
    const date = this.treeNode.content.endTime(column)
    return '' + date.getHours() + ':' + padStart('' + date.getMinutes(), 2, '0')
  }

  indentDecrease($event: Event) {
    $event.preventDefault()
    ;(this.treeNode as any as ApfNonRootTreeNode).indentDecrease()
    this.focusNewlyCreatedNode(this.treeNode as any as ApfBaseTreeNode) // FIXME this will not work correctly when multi-parents get fully implemented
  }

  indentIncrease($event: Event) {
    $event.preventDefault()
    ;(this.treeNode as any as ApfNonRootTreeNode).indentIncrease()
    this.focusNewlyCreatedNode(this.treeNode as any as ApfBaseTreeNode) // FIXME this will not work correctly when multi-parents get fully implemented
  }

  onArrowRightOnRightMostCell() {
    // if ( getActiveElementCaretPos() === 0 ) {
    this.focusNodeBelowAtBeginningOfLine()
    // }
  }

  onKeyDownBackspaceOnEstimatedTime() {
    if ( getActiveElementCaretPos() === 0
      && this.treeNode.content.itemData.estimatedTime === ''
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
    // TODO: move to our own modal service - single line with passing treeNode
    // const modalRef = this.modalService.open(ConfirmDeleteTreeNodeComponent);
    // const component = modalRef.componentInstance as ConfirmDeleteTreeNodeComponent
    // component.treeNode = this.treeNode;
  }

  onArrowLeft() {
    if ( getSelectionCursorState().atStart )  {
      if ( this.isFocusAtLeftmostColumn ) {
        this.focusNodeAboveAtEnd()
      } else {
        this.focusColumnToTheLeft()
      }
    }
  }

  onArrowRight() {
    if ( getSelectionCursorState().atEnd ) {
      if ( this.isFocusAtRightmostColumn ) {
        this.onArrowRightOnRightMostCell()
      } else {
        this.focusColumnToTheRight()

      }
    }
  }

  public focusColumnToTheRight() {
    const colIdx = this.columns.allNotHiddenColumns.indexOf(this.focusedColumn !)
    // TODO: this should be more independent of COLUMNS and work more on CELLS level
    debugLog('coldIdx', colIdx)
    this.focus(this.columns.allNotHiddenColumns[colIdx + 1])
  }

  public focusColumnToTheLeft() {
    const colIdx = this.columns.allNotHiddenColumns.indexOf(this.focusedColumn !)
    debugLog('coldIdx', colIdx)
    this.focus(this.columns.allNotHiddenColumns[colIdx - 1])
  }

  async onClickClassIcon($event: MouseEvent) {
    const popover = await this.popoverController.create({
      component: TreeNodeMenuComponent,
      componentProps: {
        treeNode: this.treeNode,
        treeHost: this.treeHost,
        nodeContentComponent: this,
      },
      event: $event,
      translucent: true,
      mode: 'ios',
    });
    return await popover.present();
  }
}
