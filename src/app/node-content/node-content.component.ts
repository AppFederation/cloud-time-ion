import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FirestoreTreeService, debugLog} from '../shared/firestore-tree.service'
import {TreeNode} from 'primeng/primeng'
import {OryTreeNode} from '../shared/TreeModel'
import {TreeHostComponent} from '../tree-host/tree-host.component'

@Component({
  selector: 'app-node-content',
  templateUrl: './node-content.component.html',
  styleUrls: ['./node-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NodeContentComponent implements OnInit, AfterViewInit {

  // @Input() node: TreeNode & {dbId: string}
  @Input() node: OryTreeNode
  @Input() treeHost: TreeHostComponent
  // @Input() node2
  @ViewChild('input') inputEl: ElementRef;
  // https://stackoverflow.com/questions/44479457/angular-2-4-set-focus-on-input-element

  nodeIndex = 0

  constructor(
    public dbService: FirestoreTreeService,
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

  focusInput() {
    this.inputEl.nativeElement.focus()
  }

  ngAfterViewInit(): void {
   this.focusInput()
  }

  delete() {
    this.dbService.delete(this.node.dbId)
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
    this.dbService.addNode(this.node.dbId)
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
    this.treeHost.focusNode(nodeToFocus)
  }

  public focusNodeBelow() {
    const nodeToFocus = this.node.getNodeBelow()
    this.treeHost.focusNode(nodeToFocus)

  }

  focus() {
    this.focusInput()
  }
}
