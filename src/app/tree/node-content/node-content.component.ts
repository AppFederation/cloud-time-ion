import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {FirestoreTreeService, debugLog} from '../../shared/firestore-tree.service'
import {TreeNode} from 'primeng/primeng'
import {OryTreeNode} from '../../shared/TreeModel'
import {TreeHostComponent} from '../tree-host/tree-host.component'
import {OryColumn} from '../OryColumn'
import {DbTreeService} from '../../shared/db-tree-service'
import {DomSanitizer} from '@angular/platform-browser'
import { isNullOrUndefined } from 'util'
import { DialogService } from '../../core/dialog.service'
// import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';

/** https://stackoverflow.com/a/3976125/170451 */
function getCaretPosition(editableDiv) {
  var caretPos = 0,
    sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == editableDiv) {
        caretPos = range.endOffset;
      }
    }
  } // else if (document.selection && document.selection.createRange) {
  //   range = document.selection.createRange();
  //   if (range.parentElement() == editableDiv) {
  //     var tempEl = document.createElement("span");
  //     editableDiv.insertBefore(tempEl, editableDiv.firstChild);
  //     var tempRange = range.duplicate();
  //     tempRange.moveToElementText(tempEl);
  //     tempRange.setEndPoint("EndToEnd", range);
  //     caretPos = tempRange.text.length;
  //   }
  // }
  return caretPos;
}

/* Consider renaming to "view slots" - more generic than columns, while more view-related than "property".
 * Or maybe PropertyView ? */
export class Columns {
  title = new OryColumn('title')
  estimatedTime = new OryColumn('estimatedTime')
  isDone = new OryColumn('isDone')
  allColumns = [
    this.title,
    this.estimatedTime,
    this.isDone,
  ]
}

@Component({
  selector: 'app-node-content',
  templateUrl: './node-content.component.html',
  styleUrls: ['./node-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NodeContentComponent implements OnInit, AfterViewInit {

  static columnsStatic = new Columns()

  columns: Columns = NodeContentComponent.columnsStatic

  // titleValue
  // initialTitle: string
  // estimatedTimeModel: number

  isDone: boolean = false

  // @Input() node: TreeNode & {dbId: string}
  @Input() treeNode: OryTreeNode
  @Input() treeHost: TreeHostComponent
  // @Input() node2
  @ViewChild('inputEstimatedTime') elInputEstimatedTime: ElementRef;
  @ViewChild('inputTitle')         elInputTitle: ElementRef;
  // https://stackoverflow.com/questions/44479457/angular-2-4-set-focus-on-input-element

  // nodeIndex = 0
  private focusedColumn: OryColumn

  // isApplyingFromDbNow = false

  editedHere = new Map<OryColumn, boolean>()
  private mapColumnToEventEmitterOnChange = new Map<OryColumn, EventEmitter<any>>()

  constructor(
    public dbService: DbTreeService,
    public sanitizer: DomSanitizer,
    public dialogService: DialogService,
  ) { }

  ngOnInit() {
    debugLog('ngOnInit', this.treeNode.nodeInclusion)
    // debugLog('node content node', this.treeNode)
    // debugLog('n2', this.node2)
    // this.nodeIndex = this.treeNode.getIndexInParent()
    this.treeHost.registerNodeComponent(this)
    // this.elInputTitle.nativeElement.value = 'title: ' + (this.treeNode.itemData as any).title

    this.elInputEstimatedTime
      .nativeElement.addEventListener('input', (ev) => this.onInputChanged(ev, this.columns.estimatedTime));
    this.elInputTitle
      .nativeElement.addEventListener('input', (ev) => this.onInputChanged(ev, this.columns.title));

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

    this.treeNode.onChangeItemData.subscribe(() => {
      const focusedColumn = undefined // this.columns.title
      this.applyItemDataValuesToViews()
    })
    this.subscribeDebouncedOnChangePerColumns()

  }

  private applyItemDataValuesToViews() {
// estimated time:
    let newEstimatedTime = this.treeNode.itemData.estimatedTime
    if (newEstimatedTime === undefined || newEstimatedTime === null) {
      newEstimatedTime = ''
    }
    console.log('newEstimatedTime, ', newEstimatedTime)
    if (this.elInputEstimatedTime.nativeElement.value === newEstimatedTime) {
      this.editedHere.set(this.columns.estimatedTime, false)
    } else {
      if ( ! this.editedHere.get(this.columns.estimatedTime) ) {
        this.elInputEstimatedTime.nativeElement.value = newEstimatedTime
        // FIXME: note, this should also take focus into account
      }
    }

    // title:
    const newTitle = this.treeNode.itemData.title
    if (this.elInputTitle.nativeElement.innerHTML === newTitle) {
      this.editedHere.set(this.columns.title, false)
    } else {
      if ( ! this.editedHere.get(this.columns.title) ) {
        this.elInputTitle.nativeElement.innerHTML = newTitle
        // FIXME: note, this should also take focus into account
      }

    }

    this.isDone = this.treeNode.itemData.isDone
    if ( isNullOrUndefined(this.isDone) ) {
      this.isDone = false;
    }
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   for (let propName in changes) {
  //     let chng = changes[propName];
  //     // let cur  = JSON.stringify(chng.currentValue);
  //     // let prev = JSON.stringify(chng.previousValue);
  //     console.log('ngOnChanges', propName, chng)
  //   }
  // }

  ngAfterViewInit(): void {
   this.focus()
  }

  delete() {
    this.dialogService.showDeleteDialog(() => {
      // TODO: delete node inclusion and the node itself
      this.dbService.delete(this.treeNode.itemId)
    })
  }

  addChild() {
    const newTreeNode = this.treeNode.addChild()
    this.treeNode.expanded = true
    setTimeout(() => {
      this.treeHost.focusNode(newTreeNode)
    })
    // this.addChildToDb()
    // if ( ! this.node.children ) {
    //   this.node.children = []
    // }
    // this.node.children.push({
    //   label: 'new child'
    // })
  }

  private addChildToDb() {
    // this.dbService.addNode(this.node.dbId)
  }

  keyPressEnter(event) {
    event.preventDefault()
    this.addNodeAfterThis()
    console.log('key press enter; node: ', this.treeNode)
  }

  keyPressMetaEnter(event) {
    console.log('keyPressMetaEnter')
    this.isDone = ! this.isDone
    this.onInputChanged(null, this.columns.isDone)
    this.focusNodeBelow()
  }

  private addNodeAfterThis() {
    this.treeNode.addSiblingAfterThis()
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
    // Note: it was changed from input to contenteditable, so needs reworking
    // const element = <HTMLInputElement>document.activeElement
    // const start = element.selectionStart === 0

    const start = getCaretPosition(this.elInputTitle.nativeElement) === 0
    if (start) {
      this.focus(this.columns.estimatedTime)
    }
  }

  focusToDescription() {
    const element = <HTMLInputElement>document.activeElement
    const end = element.selectionEnd === ('' + element.value).length

    if (end) {
      this.focus(<HTMLInputElement>this.columns.title)
    }
  }

  focusOtherNode(nodeToFocus: OryTreeNode) {
    console.log('focusOtherNode this.focusedColumn', this.focusedColumn)
    this.treeHost.focusNode(nodeToFocus, this.focusedColumn)
  }

  focus(column?: OryColumn) {
    const toFocus = this.getComponentByColumnOrDefault(column)
    toFocus.nativeElement.focus()
  }

  getComponentByColumnOrDefault(column?: OryColumn) {
    if ( column === this.columns.estimatedTime) {
      return this.elInputEstimatedTime
    } else {
      return this.elInputTitle
    }
  }

  onColumnFocused(column: OryColumn, event) {
    this.focusedColumn = column
    this.treeHost.lastFocusedColumn = column
    this.treeHost.lastFocusedNode = this.treeNode
  }

  onChangeEstimatedTime() {
    console.log('onChangeEstimatedTime')
  }

  onChange(e) {
    console.log('onInputChanged onChange', e)
  }

  onInputChanged(e, column) {
    this.editedHere.set(column, true)
    this.onChange(e)
    this.getEventEmitterOnChangePerColumn(column).emit(column)
  }

  reorderUp(event) {
    this.treeNode.reorderUp()
  }

  reorderDown(event) {
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
        1000 /* 500ms almost real-time feeling without overwhelming firestore.
        Perhaps Firestore has "SLA" of around 1second latency anyway (I recall reading something like that,
        where they contrasted the latency with Firebase Realtime DB.
        At 500ms Firefox seems to be lagging behind like even up to 3 seconds after finishing typing */,
        undefined, {
          leading: true /* probably thanks to this, the first change, of a series, is immediate (observed experimentally) */,
          trailing: true /* ensures last value is not lost;
            http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-throttleTime */
        }
      ).subscribe((changeEvent) => {
        console.log('onInputChanged; isApplyingFromDbNow', this.treeNode.treeModel.isApplyingFromDbNow)
        if ( ! this.treeNode.treeModel.isApplyingFromDbNow ) {
          const titleVal = this.elInputTitle.nativeElement.innerHTML
          const estimatedTimeVal = this.elInputEstimatedTime.nativeElement.value
          // console.log('input val: ' + titleVal)
          this.treeNode.patchItemData({
            title: titleVal,
            estimatedTime: estimatedTimeVal,
            isDone: this.isDone,
          })
        } // else: no need to react, since it is being applied from Db
      })
    }
  }
}
