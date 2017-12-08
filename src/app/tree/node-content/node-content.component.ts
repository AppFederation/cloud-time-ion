import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FirestoreTreeService, debugLog} from '../../shared/firestore-tree.service'
import {TreeNode} from 'primeng/primeng'
import {OryTreeNode} from '../../shared/TreeModel'
import {TreeHostComponent} from '../tree-host/tree-host.component'
import {OryColumn} from '../OryColumn'
import {DbTreeService} from '../../shared/db-tree-service'

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

  // @Input() node: TreeNode & {dbId: string}
  @Input() node: OryTreeNode
  @Input() treeHost: TreeHostComponent
  // @Input() node2
  @ViewChild('inputEstimatedTime') elInputEstimatedTime: ElementRef;
  @ViewChild('inputTitle')         elInputTitle: ElementRef;
  // https://stackoverflow.com/questions/44479457/angular-2-4-set-focus-on-input-element

  nodeIndex = 0
  private focusedColumn: OryColumn

  constructor(
    public dbService: DbTreeService,
  ) { }

  ngOnInit() {
    debugLog('node content node', this.node)
    // debugLog('n2', this.node2)
    this.nodeIndex = this.node.getIndexInParent()
    this.treeHost.registerNodeComponent(this)
  }

  shiftFocusToTime() {
    document.getElementById('time_' + this.nodeIndex).focus()
  }

  shiftFocusToDescription() {
    document.getElementById('description_' + this.nodeIndex).focus()
  }

  // private getElementByXpath(path) {
  //   console.log('getElementByXpath')
  //
  //   const input: HTMLElement = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
  //       .singleNodeValue.parentElement;
  //
  //   return input
  // }

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

  keyPressEnter() {
    this.addNodeAfterThis()
    console.log('key press enter; node: ', this.node)
  }

  private addNodeAfterThis() {
    this.node.addSiblingAfterThis()
  }

  public focusNodeAbove() {
    const nodeToFocus = this.node.getNodeAbove()
    this.focusOtherNode(nodeToFocus)
  }

  public focusNodeBelow() {
    const nodeToFocus = this.node.getNodeBelow()
    this.focusOtherNode(nodeToFocus)
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
}
