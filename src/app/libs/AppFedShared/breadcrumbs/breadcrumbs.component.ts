import { Component, OnInit } from '@angular/core';
import {BaseComponent} from '../base/base.component'

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.sass'],
})
export class BreadcrumbsComponent extends BaseComponent implements OnInit {

  constructor() { super() }

  ngOnInit() {}

}
