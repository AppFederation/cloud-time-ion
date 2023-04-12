import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TreeHostComponent } from '../../tree-host/tree-host/tree-host.component'
import { debugLog } from '../../utils/log'
import {ApfBaseTreeNode, OryBaseTreeNode, OryNonRootTreeNode, RootTreeNode} from '../../tree-model/RootTreeNode'
import {ApfNonRootTreeNode} from '../../tree-model/TreeNode'

@Component({
  selector: 'app-nested-tree-node',
  templateUrl: './nested-tree-node.component.html',
  styleUrls: ['./nested-tree-node.component.scss']
})
export class NestedTreeNodeComponent implements OnInit {

  alwaysExpanded = false

  isVisualRoot: boolean = false

  @Input()
  treeNode!: OryBaseTreeNode

  /* Hack to force new instance of component for input changes*/
  @Input()
  treeNodeWrapperHack!: {wrapperHack: OryBaseTreeNode}


  @Input()
  treeHost!: TreeHostComponent

  public isDragOver = false

  get itemId() {
    return this.treeNode.itemId
  }

  constructor() {
  }

  ngOnInit() {
    if (this.treeNodeWrapperHack) {
      this.treeNode = this.treeNodeWrapperHack.wrapperHack
    }
    this.isVisualRoot = this.treeNode.isVisualRoot
    this.alwaysExpanded = this.isVisualRoot
    debugLog('NestedTreeNodeComponent treeNode', this.treeNode, this.treeNode.treeModel.root, this.treeNode.treeModel.navigation.visualRoot)
  }

  toggleExpand(event: any) {
    debugLog('expand', event)
    this.treeNode.expansion.toggleExpansion(event.altKey)
  }

  onDrag($event: DragEvent) {
    console.log(`onDrag`, $event)
    $event.dataTransfer!.setData('text', this.treeNode.itemId);
  }

  onDragStart($event: DragEvent) {
    console.log(`onDragStart`, $event)
    $event.dataTransfer!.setData('text', this.treeNode.itemId);
    $event.stopImmediatePropagation()
  }

  onDragOver($event: DragEvent, isEntered: boolean) {
    this.isDragOver = isEntered
  }

  onDragOver2($event: DragEvent) {
    const draggedItemId = $event.dataTransfer?.getData('text')
    console.log('onDragOver2 2', draggedItemId, `<- draggedItemId`, $event)

    if ( draggedItemId !== this.itemId ) {
      $event.preventDefault();
    }
  }

  onDragDrop($event: DragEvent) {
    const draggedItemId = $event.dataTransfer?.getData('text')
    console.log('onDragDrop 2', draggedItemId, $event)
    if ( draggedItemId ) {
      this.isDragOver = false
      console.log('onDragDrop drop worked', draggedItemId !== this.itemId)
      $event.stopImmediatePropagation()
      const droppedNodes: ApfBaseTreeNode[] = this.treeNode.treeModel.getNodesByItemId(draggedItemId)
      // const nodes = this.clipboardService.nodesInClipboard
      this.treeNode.moveInclusionsHere(droppedNodes as OryNonRootTreeNode[], {beforeNode: undefined}) // TODO: order
      // console.log(`droppedNode`, droppedNode)
    }

  }

}
