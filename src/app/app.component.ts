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


  constructor(
    private nodesService: NodesService,
    public dbService: DbService,
  ) {

  }

}
