import {Component, Input, OnInit} from '@angular/core';
import {LearnItem$} from '../../../models/LearnItem$'
import {SelectionManager} from '../../SelectionManager'
import {ItemListInterface} from '../item-list-interface'

@Component({
  selector: 'virtual-list',
  templateUrl: './virtual-list.component.html',
  styleUrls: ['./virtual-list.component.sass'],
})
export class VirtualListComponent implements OnInit, ItemListInterface {

  @Input()
  items: LearnItem$[] | undefined;

  public selectionManager: SelectionManager = new SelectionManager<any>();

  constructor() { }

  ngOnInit() {
    this.items = this.safeItems();
  }

  safeItems() {
    return this.items == undefined ? [] : this.items;
  }

  trackByFn(index: number, item: LearnItem$) {
    return item.id
  }
}
