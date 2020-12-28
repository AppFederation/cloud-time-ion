import { Component, OnInit } from '@angular/core';
import {DisplayList} from './display-list'
import {LocalDebugOptionsService} from '../../../../apps/Learn/core/local-debug-options.service'

@Component({
  selector: 'app-display-list-options',
  templateUrl: './display-list-options.component.html',
  styleUrls: ['./display-list-options.component.sass'],
})
export class DisplayListOptionsComponent implements OnInit {

  public lists = DisplayList.displayLists;

  public selectedDisplayList: DisplayList;

  constructor(private localDebugOptionsService: LocalDebugOptionsService) {
    this.selectedDisplayList = localDebugOptionsService.getCurrentDisplayListValue();
  }

  ngOnInit() {}

  onSelected(list: DisplayList) {
    this.selectedDisplayList = list;
    this.localDebugOptionsService.toggleDisplayList(this.selectedDisplayList);
  }
}
