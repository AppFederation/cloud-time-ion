import { Component, OnInit } from '@angular/core';
import {TreeDragDropService, TreeNode} from 'primeng/primeng'
import {TreeService} from '../../tree-model/tree.service'
import {NodeFocusOptions, OryTreeNode, TreeModel} from '../../tree-model/TreeModel'
import {NodeContentComponent} from '../../tree-shared/node-content/node-content.component'
import {OryColumn} from '../../tree-shared/OryColumn'
import {
  debugLog,
  } from '../../utils/log'
import {DbTreeService} from '../../tree-model/db-tree-service'
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
} from '@angular/router'
import { DebugService } from '../../core/debug.service'
import { CommandsService } from '../../core/commands.service'
import { FIXME } from '../../utils/log'


@Component({
  selector: 'app-tree-host',
  templateUrl: './tree-host.component.html',
  styleUrls: ['./tree-host.component.scss']
})
export class TreeHostComponent implements OnInit {

  treeModel: TreeModel// = new TreeModel(this.treeService2)

  focusedId = 0

  showTree = false

  pendingListeners = 0

  mapNodeToComponent = new Map<OryTreeNode, NodeContentComponent>()

  useNestedTree = true

  constructor(
    public treeService: TreeService,
    public treeService2: DbTreeService,
    public treeDragDropService: TreeDragDropService,
    private activatedRoute : ActivatedRoute,
    private debugService: DebugService,
    private commandsService: CommandsService,
  ) {
    this.activatedRoute.snapshot.params['rootNodeId']

    commandsService.commands$.subscribe(command => {
      const lastFocusedNode = this.treeModel.focus.lastFocusedNode
      /*  */ if ( command === 'reorderUp' ) {
        if ( lastFocusedNode ) {
          lastFocusedNode.reorderUp()
        }
      } else if ( command === 'reorderDown' ) {
        if ( lastFocusedNode ) {
          lastFocusedNode.reorderDown()
        }
      } else if ( command === 'toggleDone' ) {
        if ( lastFocusedNode ) {
          lastFocusedNode.toggleDone()
        }
      }
    })
    treeDragDropService.dragStop$.subscribe((...args) => {
      console.log('dragStop$', args)
    })
    // treeDragDropService.

    this.treeModel = this.treeService.getRootTreeModel()
    const thisComponent = this
    this.treeModel.treeListener = {
      onAfterNodeMoved() {
        thisComponent.reFocusLastFocused()
      }
    }

  }

  reFocusLastFocused() {
    debugLog('reFocusLastFocused')
    setTimeout(() => {
      debugLog('reFocusLastFocused in setTimeout, ', this.treeModel.focus.lastFocusedNode, this.treeModel.focus.lastFocusedColumn)
      this.focusNode(this.treeModel.focus.lastFocusedNode, this.treeModel.focus.lastFocusedColumn)
    })
  }


  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const rootNodeInclusionId = params['rootNodeId']
      console.log('activatedRoute.params.subscribe rootNodeId', rootNodeInclusionId)
      const node = this.treeModel.mapNodeInclusionIdToNode.get(rootNodeInclusionId)
      node && node.navigateInto()
    })

    setTimeout(() => {
      this.showTree = true
      // this.appendNode()
      // this.appendNode()
      // this.appendNode()
    }, 0 /*2000*/)
  }

  keyDownEnter() {
    this.appendNode()
  }

  keyDownArrow() {
    this.focusNodeById(this.focusedId + 1)
  }

  keyUpArrow() {
    this.focusNodeById(this.focusedId - 1)
  }

  private focusNodeById(id: number) {
    const elementById: HTMLElement = document.getElementById('node' + id)
    if ( elementById ) {
      elementById.focus()
      this.focusedId = id
    }
  }

  appendNode() {
    // this.treeService.addNode(this.treeModel.root.getLastChild(), null) // FIXME
    // const newNode = new OryTreeNode(null, this.fakeId ++, this.treeModel)
    // this.treeModel.root._appendChild(newNode) // FIXME: dummy impl
    this.treeModel.navigation.visualRoot.addChild()
  }

  private remove(id) {
    this.treeModel.root.children = this.treeModel.root.children.filter(el => {
      return (<any>el).itemId !== id
    })

  }

  expandAll() {
    this.treeModel.navigation.visualRoot.expansion.setExpansion(true, true)
  }

  collapseAll() {
    this.treeModel.navigation.visualRoot.expansion.setExpansion(false, true)
  }

  registerNodeComponent(nodeComp: NodeContentComponent) {
    this.mapNodeToComponent.set(nodeComp.treeNode, nodeComp)
  }

  getComponentForNode(node: OryTreeNode) {
    return this.mapNodeToComponent.get(node)
  }

  focusNode(node: OryTreeNode, column?: OryColumn, options?: NodeFocusOptions) {
    debugLog('focusNode', arguments)
    if ( ! node ) {
      return
    }
    node.expansion.setExpansionOnParentsRecursively(true)
    setTimeout(() => {
      const component: NodeContentComponent = this.getComponentForNode(node)
      component.focus(column, options)
      this.treeModel.focus.ensureNodeVisibleAndFocusIt(node, column, options)
    })
  }

  onDebugChange($event) {
    debugLog('$event', $event)
    this.debugService.isDebug$.next($event.target.checked)
  }

  navigateUp($event) {
    this.treeModel.navigation.navigateToParent()
  }

  navigateToRoot($event) {
    this.treeModel.navigation.navigateToRoot()
  }

  newNodeAtVisualRoot() {
    const newTreeNode = this.treeModel.navigation.visualRoot.addChild()
    this.focusNode(newTreeNode)
  }

  planToday() {
    this.commandsService.planToday()
    const lastPlanNode = this.treeModel.getNodesByItemId('item_35023937-195c-4b9c-b265-5e8a01cf397e')[0].lastChildNode
    lastPlanNode.parent2.navigateInto()
    lastPlanNode.expansion.setExpansion(true, {recursive: false})
    this.focusNode(lastPlanNode)
  }
}
