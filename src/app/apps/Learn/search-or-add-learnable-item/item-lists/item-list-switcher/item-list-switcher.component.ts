import {Component, Input, OnInit} from '@angular/core';
import {LearnItem$} from '../../../models/LearnItem$'
import {LocalDebugOptionsService} from '../../../core/local-debug-options.service'

@Component({
  selector: 'item-list-switcher',
  templateUrl: './item-list-switcher.component.html',
  styleUrls: ['./item-list-switcher.component.sass'],
})
export class ItemListSwitcherComponent implements OnInit {

  @Input()
  items: LearnItem$[] | undefined;

  selectedListId = "";

  constructor(localDebugOptionsService: LocalDebugOptionsService) {
    localDebugOptionsService.displayList$.subscribe(displayList => {
      this.selectedListId = displayList.id;
    });
  }

  ngOnInit() {}

}
