import { Component, OnInit } from '@angular/core';
import {DbService, NodeAddEvent} from '../db.service'
import {TreeNode} from 'primeng/primeng'

@Component({
  selector: 'app-tree-host',
  templateUrl: './tree-host.component.html',
  styleUrls: ['./tree-host.component.scss']
})
export class TreeHostComponent implements OnInit {

  rootNodes: TreeNode[] = [];
  focusedId = 0

  showTree = false

  pendingListeners = 0

  mapIdToNode = new Map<string, TreeNode>();

  constructor(
    public dbService: DbService
  ) { }

  ngOnInit() {
    const componentThis = this
    this.dbService.loadNodesTree({
      onNodeAdded(event: NodeAddEvent) {
        componentThis.onNodeAdded(event)
      }
    })

  }

  private onNodeAdded(event: NodeAddEvent) {
    console.log('onNodeAdded: event.immediateParentId: ', event.immediateParentId)
    const newNode = this.createNode('node from event: ' + event.id)
    newNode.dbId = event.id
    if ( ! event.immediateParentId ) {
      this.rootNodes.push(newNode)
    } else {
      const parentNode = this.mapIdToNode.get(event.immediateParentId)
      let children = parentNode.children
      if ( ! children ) {
        children = []
        parentNode.children = children
      }
      children.push(newNode)
    }
    this.mapIdToNode.set(event.id, newNode) // NOTE: does not yet support the same node being in multiple places

    // expand
    this.expandRecursive(newNode, true)
    this.pendingListeners = event.pendingListeners
  }

  // this.appendNode()
  // this.nodesService.getTouristPlaces().subscribe(
  //   (places: any) => this.dragDropTreeOne = places);
  // this.dbService.listenToChanges(s => {
  //   s.docChanges.forEach(change => {
  //     console.log('change', change)
  //     let data = change.doc.data()
  //     console.log('change.doc.data()', data)
  //     if (change.type === 'added') {
  //       console.log('New city: ', data);
  //       // this.elements.push(data)
  //       // this.elements = this.elements.slice(0)
  //       let node = this.createNode(data)
  //       node.dbId = change.doc.id
  //       console.log('change.doc.id', change.doc.id)
  //       this.dragDropTreeOne.push(node)
  //     }
  //     if (change.type === 'modified') {
  //       console.log('Modified city: ', data);
  //     }
  //     if (change.type === 'removed') {
  //       console.log('Removed city: ', data);
  //       this.remove(change.doc.id)
  //     }
  //   });
  // })


  keyDownEnter() {
    this.appendNode()
  }

  keyDownArrow() {
    this.focusNode(this.focusedId + 1)
  }

  keyUpArrow() {
    this.focusNode(this.focusedId - 1)
  }

  private focusNode(id: number) {
    const elementById = document.getElementById('node' + id)
    if ( elementById ) {
      elementById.focus()
      this.focusedId = id
    }
  }

  private appendNode() {
    let newNode: TreeNode = this.createNode()
    newNode.children = [
      this.createNode('CHILD')
    ]
    this.rootNodes.push(newNode)
  }

  private createNode(label?) {
    return <any>{
      'id': this.rootNodes.length,
      'label': label || 'Asia',
      'data': 'Documents Folder',
    }
  }

  private remove(id) {
    this.rootNodes = this.rootNodes.filter(el => {
      return (<any>el).dbId !== id
    })

  }

  expandAll() {
    this.rootNodes.forEach( (node: any) => {
      this.expandRecursive(node, true);
    } );
  }

  expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach( childNode => {
        this.expandRecursive(childNode, isExpand);
      } );
    }
  }


}
