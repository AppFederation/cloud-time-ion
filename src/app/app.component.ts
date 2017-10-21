import { Component, ViewEncapsulation } from '@angular/core';
import {TreeNode, UITreeNode} from 'primeng/primeng'
import {NodesService} from './nodes.service'
import {DbService} from './db.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

  dragDropTreeOne: TreeNode[] = [];
  focusedId = 0

  constructor(
    private nodesService: NodesService,
    public dbService: DbService,
  ) {
    // this.appendNode()
    // this.nodesService.getTouristPlaces().subscribe(
    //   (places: any) => this.dragDropTreeOne = places);
    this.dbService.listenToChanges(s => {
      s.docChanges.forEach(change => {
        console.log('change', change)
        let data = change.doc.data()
        console.log('change.doc.data()', data)
        if (change.type === 'added') {
          console.log('New city: ', data);
          // this.elements.push(data)
          // this.elements = this.elements.slice(0)
          let node = this.createNode(data)
          node.dbId = change.doc.id
          console.log('change.doc.id', change.doc.id)
          this.dragDropTreeOne.push(node)
        }
        if (change.type === 'modified') {
          console.log('Modified city: ', data);
        }
        if (change.type === 'removed') {
          console.log('Removed city: ', data);
          this.remove(change.doc.id)
        }
      });

  })

}

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
    this.dragDropTreeOne.push(newNode)
  }

  private createNode(label?) {
    return <any>{
      'id': this.dragDropTreeOne.length,
      'label': label || 'Asia',
      'data': 'Documents Folder',
    }
  }

  private remove(id) {
    this.dragDropTreeOne = this.dragDropTreeOne.filter(el => {
      return (<any>el).dbId !== id
    })

  }
}
