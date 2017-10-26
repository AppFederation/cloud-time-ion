import { Component, ViewEncapsulation } from '@angular/core';
import {TreeNode, UITreeNode} from 'primeng/primeng'
import {DbService} from './db.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {


  constructor(
    public dbService: DbService,
  ) {

  }

}
