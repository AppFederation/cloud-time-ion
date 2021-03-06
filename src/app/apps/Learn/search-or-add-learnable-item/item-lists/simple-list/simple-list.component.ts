import {Component, Input, OnInit} from '@angular/core';
import {LearnItem$} from '../../../models/LearnItem$'

@Component({
  selector: 'simple-list',
  templateUrl: './simple-list.component.html',
  styleUrls: ['./simple-list.component.sass'],
})
export class SimpleListComponent implements OnInit {

  @Input()
  items: LearnItem$[] | undefined = []

  constructor() { }

  ngOnInit() {}

  trackByFn(index: number, item: LearnItem$) {
    return item.id
  }

}
