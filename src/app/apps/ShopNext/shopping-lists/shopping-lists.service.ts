import {Injectable, Injector} from '@angular/core';
import {ShoppingListsModule} from "./shopping-lists.module";
import {OdmService} from "../../../libs/AppFedShared/odm/OdmService";
import {ShoppingList} from "./ShoppingList";

@Injectable(/*{
  providedIn: ShoppingListsModule
}*/)
export class ShoppingListsService extends OdmService<ShoppingList> {

  constructor(
    injector: Injector,
  ) {
    super(injector, 'ShoppingList');
  }
}
