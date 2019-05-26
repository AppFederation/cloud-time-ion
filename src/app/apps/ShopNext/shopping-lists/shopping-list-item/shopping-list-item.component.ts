import {Component, Input, OnInit} from '@angular/core';
import {ShoppingList} from "../ShoppingList";

@Component({
  selector: 'app-shopping-list-item',
  templateUrl: './shopping-list-item.component.html',
  styleUrls: ['./shopping-list-item.component.sass'],
})
export class ShoppingListItemComponent implements OnInit {

  @Input() item: ShoppingList

  constructor() { }

  ngOnInit() {}

}
