import {
  Component,
  OnInit,
} from '@angular/core';
import { TreeDragDropService } from 'primeng/primeng'
import { TreeService } from '../../tree-model/tree.service'
import {
  NodeFocusOptions,
  OryTreeNode,
  TreeCell,
  TreeModel,
} from '../../tree-model/TreeModel'
import { NodeContentComponent } from '../../tree-shared/node-content/node-content.component'
import { OryColumn } from '../../tree-shared/OryColumn'
import { debugLog } from '../../utils/log'
import { ActivatedRoute } from '@angular/router'
import { DebugService } from '../../core/debug.service'
import { CommandsService } from '../../core/commands.service'
import { NavigationService } from '../../core/navigation.service'


@Component({
  selector: 'app-tree-host',
  templateUrl: './tree-host.component.html',
  styleUrls: ['./tree-host.component.scss']
})
export class TreeHostComponent implements OnInit {

  treeModel: TreeModel// = new TreeModel(this.treeService2)

  showTree = false

  pendingListeners = 0

  mapNodeToComponent = new Map<OryTreeNode, NodeContentComponent>()

  useNestedTree = true

  public showAllCols: boolean = true

  constructor(
    public treeService: TreeService,
    public treeDragDropService: TreeDragDropService,
    private activatedRoute : ActivatedRoute,
    private debugService: DebugService,
    private commandsService: CommandsService,
    private navigationService: NavigationService,
  ) {
    this.activatedRoute.snapshot.params['rootNodeId']
    this.navigationService.navigation$.subscribe(nodeId => {
      // this.treeModel.navigation.navigateInto(nodeId)
      this.focusNode(this.treeModel.getNodesByItemId(nodeId)[0])
    })

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
      this.focus(this.treeModel.focus.lastFocusedCell)
    })
  }


  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const rootNodeInclusionId = params['rootNodeId']
      console.log('activatedRoute.params.subscribe rootNodeId', rootNodeInclusionId)
      // const node = this.treeModel.mapNodeInclusionIdToNode.get(rootNodeInclusionId)
      // node && node.navigateInto()
    })

    setTimeout(() => {
      this.showTree = true
    }, 0 /*2000*/)
  }

  appendNode() {
    this.treeModel.navigation.visualRoot.addChild()
  }

  expandAll() {
    this.treeModel.navigation.visualRoot.expansion.setExpanded(true, true)
  }

  collapseAll() {
    this.treeModel.navigation.visualRoot.expansion.setExpanded(false, true)
  }

  registerNodeComponent(nodeContentComponent: NodeContentComponent) {
    this.mapNodeToComponent.set(nodeContentComponent.treeNode, nodeContentComponent)
  }

  onNodeContentComponentDestroyed(nodeContentComponent: NodeContentComponent) {
    this.mapNodeToComponent.delete(nodeContentComponent.treeNode)
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
      this.treeModel.focus.ensureNodeVisibleAndFocusIt(node, column, options)
      const component: NodeContentComponent = this.getComponentForNode(node)
      if ( component ) {
        component.focus(column, options)
      }
    })
  }

  onDebugChange($event) {
    debugLog('$event', $event)
    this.debugService.isDebug$.next($event.target.checked)
  }

  navigateUp($event) {
    this.treeModel.navigation.navigateToParent()
    this.reFocusLastFocused()
  }

  navigateToRoot($event) {
    this.treeModel.navigation.navigateToRoot()
    this.reFocusLastFocused()
  }

  newNodeAtVisualRoot() {
    const newTreeNode = this.treeModel.navigation.visualRoot.addChild()
    this.focusNode(newTreeNode)
  }

  goToMilestones() {
    const milestones = this.treeModel.getNodesByItemId('item_28cca5d5-6935-4fb1-907a-44f1f1898851')[0]//.getChildAtIndexOrNull(0)
    milestones.navigateInto()
    milestones.expansion.setExpanded(true, {recursive: false})
    this.focusNode(milestones)
  }

  planToday() {
    this.commandsService.planToday()
    const lastPlanNode = this.treeModel.getNodesByItemId('item_35023937-195c-4b9c-b265-5e8a01cf397e')[0].lastChildNode
    lastPlanNode.parent2.navigateInto()
    lastPlanNode.expansion.setExpanded(true, {recursive: false})
    this.focusNode(lastPlanNode)
  }

  newJournalEntry() {
    const journalNode = this.treeModel.getNodesByItemId('item_50872811-928d-4878-94c0-0df36667be0e')[0].addChild()
    journalNode.navigateInto()
    this.focusNode(journalNode)
  }

  newNote() {
    const noteNode = this.treeModel.getNodesByItemId('item_91c761a4-0308-43a1-8634-5164cb4d5b0e')[0].addChild()
    noteNode.navigateInto()
    this.focusNode(noteNode)
  }

  public focus(cell: TreeCell) {
    this.focusNode(cell.node, cell.column)
  }
}
