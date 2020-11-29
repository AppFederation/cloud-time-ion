import {Component, Input, OnInit} from '@angular/core';
import {LearnItem} from '../../../models/LearnItem'

@Component({
  selector: 'virtual-list',
  templateUrl: './virtual-list.component.html',
  styleUrls: ['./virtual-list.component.sass'],
})
export class VirtualListComponent implements OnInit {

  @Input()
  items: LearnItem[] | undefined;

  constructor() { }

  ngOnInit() { }

  trackByFn(index: number, item: LearnItem) {
    return item.id
  }
}
