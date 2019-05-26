import { Component, OnInit } from '@angular/core';
import {ShoppingListsService} from "../shopping-lists.service";
import {debugLog} from "../../../AppFedShared/utils/log";

@Component({
  selector: 'app-shopping-lists-list',
  templateUrl: './shopping-lists-list.component.html',
  styleUrls: ['./shopping-lists-list.component.sass'],
})
export class ShoppingListsListComponent implements OnInit {

  constructor(
    public shoppingListsService: ShoppingListsService,
  ) {
    debugLog('shoppingListsService', this.shoppingListsService)
  }

  ngOnInit() {}

}
