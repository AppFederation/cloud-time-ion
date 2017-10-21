import { Component, ViewEncapsulation } from '@angular/core';
import {UITreeNode} from 'primeng/primeng'
import {NodesService} from './nodes.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

  dragDropTreeOne: UITreeNode[] = [];
  focusedId = 0

  constructor(
    private nodesService: NodesService
  ) {
    this.appendNode()
    // this.nodesService.getTouristPlaces().subscribe(
    //   (places: any) => this.dragDropTreeOne = places);
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
    this.dragDropTreeOne.push(this.createNode())
  }

  private createNode() {
    return <any>{
      'id': this.dragDropTreeOne.length,
      'label': 'Asia',
      'data': 'Documents Folder',
    }
  }

}
