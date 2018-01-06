import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FirestoreTreeService, debugLog} from '../../shared/firestore-tree.service'
import {TreeNode} from 'primeng/primeng'
import {OryTreeNode} from '../../shared/TreeModel'
import {TreeHostComponent} from '../tree-host/tree-host.component'
import {OryColumn} from '../OryColumn'
import {DbTreeService} from '../../shared/db-tree-service'
import {DomSanitizer} from '@angular/platform-browser'

export class Columns {
  title = new OryColumn('title')
  estimatedTime = new OryColumn('estimatedTime')
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

  titleValue
  initialTitle: string

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

  constructor(
    public dbService: DbTreeService,
    public sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    debugLog('node content node', this.treeNode)
    // debugLog('n2', this.node2)
    // this.nodeIndex = this.treeNode.getIndexInParent()
    this.treeHost.registerNodeComponent(this)
    // this.elInputTitle.nativeElement.value = 'title: ' + (this.treeNode.itemData as any).title
    this.elInputTitle.nativeElement.addEventListener('input', this.onInputChanged.bind(this));
    this.initialTitle = this.treeNode.itemData.title /* note: shortcut that I took: not yet updating title in realtime
    */
    // this.elInputTitle.nativeElement.innerHTML = this.sanitizer.bypassSecurityTrustHtml(this.initialTitle);
    this.elInputTitle.nativeElement.innerHTML = this.initialTitle;

  }

  ngAfterViewInit(): void {
   this.focus()
  }

  delete() {
    // this.dbService.delete(this.node.dbId)
  }

  addChild() {
    this.addChildToDb()
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

  private addNodeAfterThis() {
    this.treeNode.addSiblingAfterThis()
  }

  public focusNodeAbove() {
    const nodeToFocus = this.treeNode.getNodeAboveThis()
    this.focusOtherNode(nodeToFocus)
  }

  public focusNodeBelow() {
    const nodeToFocus = this.treeNode.getNodeBelowThis()
    this.focusOtherNode(nodeToFocus)
  }

  focusToEstimatedTime() {
    // Note: it was changed from input to contenteditable, so needs reworking
    const element = <HTMLInputElement>document.activeElement
    const start = element.selectionStart === 0

    if (start) {
      this.focus(this.columns.estimatedTime)
    }
  }

  focusToDescription() {
    const element = <HTMLInputElement>document.activeElement
    const end = element.selectionEnd === element.maxLength - 1

    if (end) {
      this.focus(<HTMLInputElement>this.columns.title)
    }
  }

  focusOtherNode(nodeToFocus: OryTreeNode) {
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

  onColumnFocused(column) {
    this.focusedColumn = column
  }

  onChangeEstimatedTime() {
    console.log('onChangeEstimatedTime')
  }

  onChange(e) {
    console.log('onInputChanged onChange', e)
  }

  onInputChanged(e) {
    this.onChange(e)
    console.log('onInputChanged isApplyingFromDbNow', this.treeNode.treeModel.isApplyingFromDbNow)
    if ( ! this.treeNode.treeModel.isApplyingFromDbNow ) {
      const titleVal = this.elInputTitle.nativeElement.innerHTML
      console.log('input val: ' + titleVal)
      this.treeNode.patchItemData({
        title: titleVal
      })
    } // else: no need to react, since it is being applied from Db
  }
}
