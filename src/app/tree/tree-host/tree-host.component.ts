import { Component, OnInit } from '@angular/core';
import {TreeDragDropService, TreeNode} from 'primeng/primeng'
import {TreeService} from '../../shared/tree.service'
import {OryTreeNode, TreeModel} from '../../shared/TreeModel'
import {NodeContentComponent} from '../node-content/node-content.component'
import {OryColumn} from '../OryColumn'
import {
  debugLog,
  } from '../../shared/log'
import {DbTreeService} from '../../shared/db-tree-service'
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
} from '@angular/router'
import { DebugService } from '../../core/debug.service'
import { CommandsService } from '../../core/commands.service'
import { FIXME } from '../../shared/log'


@Component({
  selector: 'app-tree-host',
  templateUrl: './tree-host.component.html',
  styleUrls: ['./tree-host.component.scss']
})
export class TreeHostComponent implements OnInit {

  treeModel: TreeModel// = new TreeModel(this.treeService2)

  // rootNodes: TreeNode[] = []
  focusedId = 0
  fakeId = 111

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

  // private onNodeAdded(event: NodeAddEvent) {
  //   debugLog('onNodeAdded: event.immediateParentId: ', event.immediateParentId)
  //   const newNode = this.createNode('node from event: ' + event.id)
  //   newNode.dbId = event.id
  //   if ( ! event.immediateParentId ) {
  //     this.rootNodes.push(newNode)
  //   } else {
  //     const parentNode = this.mapIdToNode.get(event.immediateParentId)
  //     let children = parentNode.children
  //     if ( ! children ) {
  //       children = []
  //       parentNode.children = children
  //     }
  //     children.push(newNode)
  //   }
  //   this.mapIdToNode.set(event.id, newNode) // NOTE: does not yet support the same node being in multiple places
  //
  //   // expand
  //   this.expandRecursive(newNode, true)
  //   this.pendingListeners = event.pendingListeners
  // }

  // this.appendNode()
  // this.nodesService.getTouristPlaces().subscribe(
  //   (places: any) => this.dragDropTreeOne = places);
  // this.dbService.listenToChanges(s => {
  //   s.docChanges.forEach(change => {
  //     debugLog('change', change)
  //     let data = change.doc.data()
  //     debugLog('change.doc.data()', data)
  //     if (change.type === 'added') {
  //       debugLog('New city: ', data);
  //       // this.elements.push(data)
  //       // this.elements = this.elements.slice(0)
  //       let node = this.createNode(data)
  //       node.dbId = change.doc.id
  //       debugLog('change.doc.id', change.doc.id)
  //       this.dragDropTreeOne.push(node)
  //     }
  //     if (change.type === 'modified') {
  //       debugLog('Modified city: ', data);
  //     }
  //     if (change.type === 'removed') {
  //       debugLog('Removed city: ', data);
  //       this.remove(change.doc.id)
  //     }
  //   });
  // })


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

  private createNode(label?) {
    return <any>{
      'id': this.fakeId ++,
      'label': label || 'Asia',
      'data': 'Documents Folder',
    }
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

  nodeDrop(event) {
    console.log('nodeDrop', event)
    // this.dbService.moveNode(event.dragNode.dbId, event.dropNode.dbId) // FIXME
  }

  registerNodeComponent(nodeComp: NodeContentComponent) {
    this.mapNodeToComponent.set(nodeComp.treeNode, nodeComp)
  }

  getComponentForNode(node: OryTreeNode) {
    return this.mapNodeToComponent.get(node)
  }

  focusNode(node: OryTreeNode, column?: OryColumn) {
    debugLog('focusNode', node, column)
    if ( ! node ) {
      return
    }
    node.expansion.setExpansionOnParentsRecursively(true)
    setTimeout(() => {
      const component: NodeContentComponent = this.getComponentForNode(node)
      component.focus(column)
      this.treeModel.focus.ensureNodeVisibleAndFocusIt(node, column)
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
}
