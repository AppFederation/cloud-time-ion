import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from "@angular/router";
import {ShoppingListsService} from "../shopping-lists/shopping-lists.service";
import {Recipe} from "../../CookBook/recipes-page/recipes/Recipe";
import {ListItem} from "../shopping-lists/ListItem";
import {ShoppingListItemsService} from "../shopping-lists/shopping-list-items.service";

@Component({
  selector: 'app-shopping-list-details-page',
  templateUrl: './shopping-list-details-page.component.html',
  styleUrls: ['./shopping-list-details-page.component.sass'],
})
export class ShoppingListDetailsPageComponent implements OnInit {

  routeSnapshot = this.activatedRoute.snapshot;

  createItemFunc = () => {
    const newItem = new ListItem(/*this.shoppingListsService*/ this.shoppingListItemsService);
    newItem.title = `[ new Shopping List Item ${new Date()} ]`
    return newItem
  }

  get itemId() {
    return this.routeSnapshot.params['listId']
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    public shoppingListsService: ShoppingListsService,
    public shoppingListItemsService: ShoppingListItemsService,
  ) {

  }

  ngOnInit() {

  }

}
