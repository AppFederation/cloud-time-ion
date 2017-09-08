import { Component } from '@angular/core';
import {UITreeNode} from 'primeng/primeng'
import {NodesService} from './nodes.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  dragDropTreeOne: UITreeNode[];

  constructor(
    private nodesService: NodesService
  ) {
    this.nodesService.getTouristPlaces().subscribe(
      (places: any) => this.dragDropTreeOne = places);
  }

}
