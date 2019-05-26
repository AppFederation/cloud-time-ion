import { Component, OnInit } from '@angular/core';
import {ShoppingListsService} from "../shopping-lists/shopping-lists.service";
import {ShoppingList} from "../shopping-lists/ShoppingList";

@Component({
  selector: 'app-shopping-lists-page',
  templateUrl: './shopping-lists-page.component.html',
  styleUrls: ['./shopping-lists-page.component.sass'],
})
export class ShoppingListsPageComponent implements OnInit {

  constructor(
    public shoppingListsService: ShoppingListsService,
  ) { }

  ngOnInit() {}

  onAddItem() {
    new ShoppingList(this.shoppingListsService, 'New shopping list ' + new Date()).saveNowToDb()
  }
}
