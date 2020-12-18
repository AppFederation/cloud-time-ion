import {Component, Input, OnInit} from '@angular/core';
import {LearnItem$} from '../../../models/LearnItem$'
import {SelectionManager} from '../../SelectionManager'
import {SimpleListProperties} from './simple-list-properties'

@Component({
  selector: 'simple-list',
  templateUrl: './simple-list.component.html',
  styleUrls: ['./simple-list.component.sass'],
})
export class SimpleListComponent implements OnInit {

  @Input()
  items: LearnItem$[];

  public selectionManager: SelectionManager = new SelectionManager<any>();

  currentlyDisplayedElements: number = SimpleListProperties.INITIAL_ITEM_COUNT;

  constructor() {
    this.items = [];
  }

  ngOnInit() {
    this.items = this.items === undefined ? [] : this.items;
  }

  trackByFn(index: number, item: LearnItem$) {
    return item.id
  }

  loadMore() {
    this.currentlyDisplayedElements += SimpleListProperties.LOAD_MORE_CHUNK_SIZE;
  }

  loadAll() {
    this.currentlyDisplayedElements = this.items.length;
  }
}