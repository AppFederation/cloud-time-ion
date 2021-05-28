import {Injectable, Injector} from '@angular/core';
import {ShoppingListsModule} from "./shopping-lists.module";
import {OdmService_OLD} from "../../../libs/AppFedShared/odm/OdmService_OLD";
import {ShoppingList} from "./ShoppingList";

@Injectable(/*{
  providedIn: ShoppingListsModule
}*/)
export class ShoppingListsService extends OdmService_OLD<ShoppingList> {

  constructor(
    injector: Injector,
  ) {
    super(injector, 'ShoppingList');
  }
}
