import { Component, OnInit } from '@angular/core';
import {BaseComponent} from '../../../libs/AppFedShared/base/base.component'

@Component({
  selector: 'app-mindfulness',
  templateUrl: './mindfulness.page.html',
  styleUrls: ['./mindfulness.page.sass'],
})
export class MindfulnessPage extends BaseComponent implements OnInit {

  constructor() { super() }

  ngOnInit() {
  }

}
