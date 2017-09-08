import { Component } from '@angular/core';
import {UITreeNode} from 'primeng/primeng'
import {NodesService} from './nodes.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  dragDropTreeOne: UITreeNode[];

  constructor(
    private nodesService: NodesService
  ) {
    this.nodesService.getTouristPlaces().subscribe(
      (places: any) => this.dragDropTreeOne = places);
  }

  keyDownEnter() {
    this.dragDropTreeOne.push(<any>{
      'label': 'Asia',
      'data': 'Documents Folder',
    })
  }

}
