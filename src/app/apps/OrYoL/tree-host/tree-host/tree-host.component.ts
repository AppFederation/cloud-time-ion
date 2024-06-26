import {
  Component,
  OnInit,
} from '@angular/core';
import { TreeDragDropService } from 'primeng/api'
import { TreeService } from '../../tree-model/tree.service'
import {
  ApfBaseTreeNode, NodeFocusOptions, TreeCell,
  TreeModel,
} from '../../tree-model/TreeModel'
import { NodeContentComponent } from '../../tree-shared/node-content/node-content.component'
import { OryColumn } from '../../tree-shared/OryColumn'
import { debugLog } from '../../utils/log'
import { ActivatedRoute } from '@angular/router'
import { DebugService } from '../../core/debug.service'
import {Command, CommandsService} from '../../core/commands.service'
import { NavigationService } from '../../core/navigation.service'
import {TreeTableNodeContent} from '../../tree-model/TreeTableNodeContent'
import {ApfNonRootTreeNode, RootTreeNode} from '../../tree-model/TreeNode'


@Component({
  selector: 'app-tree-host',
  templateUrl: './tree-host.component.html',
  styleUrls: ['./tree-host.component.scss']
})
export class TreeHostComponent implements OnInit {

  treeModel: TreeModel<TreeTableNodeContent>// = new TreeModel(this.treeService2)

  showTree = false

  pendingListeners = 0

  mapNodeToComponent = new Map<RootTreeNode, NodeContentComponent>()

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
    const rootNodeInclusionId = this.activatedRoute.snapshot.params['rootNodeId']
    console.log('rootNodeInclusionId', rootNodeInclusionId)
    this.navigationService.navigation$.subscribe((nodeId: string) => {
      this.treeModel.navigation.navigateInto(nodeId)
      // TODO: reFocusLastFocused()?
      const node = this.treeModel.getNodesByItemId(nodeId)[0]
      // node.expansion.setExpanded(true, {recursive: false})

      this.focusNode(node)
    })

    commandsService.commands$.subscribe((command: Command) => {
      const lastFocusedNode = this.treeModel.focus.lastFocusedNode as ApfNonRootTreeNode // (RootTreeNode | OryTreeNode)
      /*  */ if ( command === 'reorderUp' ) {
        lastFocusedNode ?. reorderUp ?. ()
      } else if ( command === 'reorderDown' ) {
        lastFocusedNode ?. reorderDown ?. ()
      } else if ( command === 'toggleDone' ) {
        lastFocusedNode ?. content.toggleDone ?. ()
      } else if ( command === 'indentLeft' ) {
        lastFocusedNode ?. indentDecrease ?. ()
      } else if ( command === 'indentRight' ) {
        lastFocusedNode ?. indentIncrease ?. ()
      }
    })
    treeDragDropService.dragStop$.subscribe((...args: any[]) => {
      console.log('dragStop$', args)
    })

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
      // console.log('activatedRoute.params.subscribe rootNodeId', rootNodeInclusionId)
      // const node = this.treeModel.mapNodeInclusionIdToNode.get(rootNodeInclusionId)
      // node && node.navigateInto()
    })

    setTimeout(() => {
      this.showTree = true
    }, 0 /*2000*/)
  }

  appendNode() {
    const newNode = this.treeModel.navigation.visualRoot!.addChild()
    setTimeout(() => {
      this.focusNode(newNode)
    })
  }

  expandAll() {
    this.treeModel.navigation.visualRoot?.expansion?.setExpanded(true, true)
  }

  collapseAll() {
    this.treeModel.navigation.visualRoot?.expansion?.setExpanded(false, true)
  }

  registerNodeComponent(nodeContentComponent: NodeContentComponent) {
    this.mapNodeToComponent.set(nodeContentComponent.treeNode, nodeContentComponent)
  }

  onNodeContentComponentDestroyed(nodeContentComponent: NodeContentComponent) {
    this.mapNodeToComponent.delete(nodeContentComponent.treeNode)
  }

  getComponentForNode(node: ApfBaseTreeNode) {
    return this.mapNodeToComponent.get(node)
  }

  focusNode(node: ApfBaseTreeNode | null | undefined, column?: OryColumn | null, options?: NodeFocusOptions) {
    debugLog('focusNode', arguments)
    if ( ! node ) {
      return
    }
    node.expansion.setExpansionOnParentsRecursively(true)
    setTimeout(() => {
      this.treeModel.focus.ensureNodeVisibleAndFocusIt(node, column, options)
      const component: NodeContentComponent | undefined = this.getComponentForNode(node)
      if ( component ) {
        component.focus(column, options)
      }
    })
  }

  navigateUp($event: Event) {
    this.treeModel.navigation.navigateToParent()
    this.reFocusLastFocused() // FIXME: move this to treeModel or reaction to navigation (or maybe it is there already)
  }

  navigateToRoot($event: Event) {
    this.treeModel.navigation.navigateToRoot()
    this.reFocusLastFocused() // FIXME: move this to treeModel or reaction to navigation (or maybe it is there already)
  }

  newNodeAtVisualRoot() {
    const newTreeNode = this.treeModel.navigation.visualRoot!.addChild()
    this.focusNode(newTreeNode)
  }

  navigateIntoItemIdExpandAndFocus(itemId: string) {
    const parentNode = this.treeModel.getNodesByItemId(itemId)[0]
    parentNode.navigateInto()
    parentNode.expansion.setExpanded(true, {recursive: false})
    this.focusNode(parentNode)
  }

  goToMilestones() {
    this.navigateIntoItemIdExpandAndFocus('item_28cca5d5-6935-4fb1-907a-44f1f1898851')
  }

  goToShopping() {
    this.navigateIntoItemIdExpandAndFocus('item_dee48f04-4795-41d4-a609-2af6ac83f3d9')
  }

  private createChildNavigateAndFocus(itemId: string) {
    const newNode = this.treeModel.getNodesByItemId(itemId)[0].addChild()
    newNode.navigateInto()
    this.focusNode(newNode)
  }

  newJournalEntry() {
    this.createChildNavigateAndFocus('item_50872811-928d-4878-94c0-0df36667be0e')
  }

  newNote() {
    this.createChildNavigateAndFocus('item_91c761a4-0308-43a1-8634-5164cb4d5b0e')
  }

  planToday(createNew?: boolean) {
    this.commandsService.planToday()
// <<<<<<< HEAD:src/app/apps/OrYoL/tree-host/tree-host/tree-host.component.ts
//     const lastPlanNode = this.treeModel.getNodesByItemId('item_35023937-195c-4b9c-b265-5e8a01cf397e')[0].lastChildNode
//     lastPlanNode ?. parent2 ?. navigateInto()
//     lastPlanNode ?. expansion ?. setExpanded(true, {recursive: false})
// =======
    const plansNode = this.treeModel.getNodesByItemId('item_35023937-195c-4b9c-b265-5e8a01cf397e')[0]
    let lastPlanNode = plansNode.lastChildNode
    if ( createNew ) {
      lastPlanNode = plansNode.addChild()
      // TODO:
      // lastPlanNode.
    }
    // lastPlanNode.parent2.navigateInto()
    lastPlanNode ?. navigateInto()
    lastPlanNode ?. expansion.setExpanded(true, {recursive: false})
// >>>>>>> 53cff336569afe0cbb192ffa667fbc86598b7a7d:OrYoL_OFF/src/app/tree-host/tree-host/tree-host.component.ts
    this.focusNode(lastPlanNode)
  }

  public focus(cell: TreeCell) {
    this.focusNode(cell.node, cell.column)
  }
}
