import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {LearnItem$} from '../../../models/LearnItem$'
import {SelectionManager} from '../../SelectionManager'
import {IntersectionObserverListProperties} from './intersection-observer-list-properties'

@Component({
  selector: 'intersection-observer-list',
  templateUrl: './intersection-observer-list.component.html',
  styleUrls: ['./intersection-observer-list.component.sass'],
})
export class IntersectionObserverListComponent implements OnInit, OnDestroy {
  @Input()
  items: LearnItem$[] | undefined;

  public selectionManager: SelectionManager = new SelectionManager<any>();

  currentlyDisplayedElements: number = IntersectionObserverListProperties.INITIAL_ITEM_COUNT;

  endElement: Element | null;

  intersectionObserver: IntersectionObserver;
  constructor() {
    this.items = [];
  }

  ngOnInit() {
    this.items = this.safeItems();
    this.endElement = document.querySelector('.end');
    this.intersectionObserver = new IntersectionObserver(entries => {
      // If intersectionRatio is 0, the target is out of view
      // and we do not need to do anything.
      if (entries[0].intersectionRatio <= 0) return;

      this.loadMore();
      console.log('Loaded new items');
    });

    // start observing

    if (this.endElement != null)  {
      this.intersectionObserver.observe(this.endElement);
    }
  }

  ngOnDestroy() {
    if (this.intersectionObserver && this.endElement != null) {
      this.intersectionObserver.unobserve(this.endElement);
    }
  }

  safeItems() {
    return this.items == undefined ? [] : this.items;
  }

  trackByFn(index: number, item: LearnItem$) {
    return item.id
  }

  loadMore() {
    this.currentlyDisplayedElements += IntersectionObserverListProperties.LOAD_MORE_CHUNK_SIZE;
  }


}
