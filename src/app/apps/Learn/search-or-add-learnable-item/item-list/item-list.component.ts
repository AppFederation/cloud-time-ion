import {Component, Input, OnInit} from '@angular/core';
import {LearnItemItemsService} from '../../core/learn-item-items.service'
import {LearnItem} from '../../models/LearnItem'
import {ListProcessing} from '../list-processing'
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.sass'],
})
export class ItemListComponent implements OnInit {

  @Required()
  @Input()
  listModel ! : ListProcessing

  get filteredItem$s() { return this.listModel.filteredItem$s }

  get item$s() { return this.listModel.item$s }


  constructor(
    public learnDoService: LearnItemItemsService,
  ) { }

  ngOnInit() {}

  trackByFn(index: number, item: LearnItem) {
    return item.id
  }

}
