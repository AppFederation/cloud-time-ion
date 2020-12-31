import {Component, Input, OnInit} from '@angular/core';
import {LearnItem$} from '../../../models/LearnItem$'
import {SelectionManager} from '../../SelectionManager'
import {ItemListInterface} from '../item-list-interface'

@Component({
  selector: 'cdk-virtual-list',
  templateUrl: './cdk-virtual-list.component.html',
  styleUrls: ['./cdk-virtual-list.component.sass'],
})
export class CdkVirtualListComponent implements OnInit, ItemListInterface {

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
