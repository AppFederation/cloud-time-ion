import {Component, Input, OnInit} from '@angular/core';
import {LearnItem$} from '../../../models/LearnItem$'
import {SelectionManager} from '../../SelectionManager'

@Component({
  selector: 'ion-virtual-list',
  templateUrl: './ion-virtual-list.component.html',
  styleUrls: ['./ion-virtual-list.component.sass'],
})
export class IonVirtualListComponent implements OnInit {

  @Input()
  items: LearnItem$[] | undefined;

  public selectionManager: SelectionManager = new SelectionManager<any>();

  constructor() { }

  ngOnInit() {
    this.items = this.items == undefined ? [] : this.items;
  }

  trackByFn(index: number, item: LearnItem$) {
    return item.id
  }

}
