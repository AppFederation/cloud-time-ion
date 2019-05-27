import {Injectable, Injector} from '@angular/core';
import {ShoppingListsModule} from "./shopping-lists.module";
import {OdmService} from "../../../libs/AppFedShared/odm/OdmService";
import {ShoppingList} from "./ShoppingList";
import {TimerItem} from "../../../core/TimerItem";

@Injectable(/*{
  providedIn: ShoppingListsModule
}*/)
export class ShoppingListsService extends OdmService<ShoppingList> {

  constructor(
    injector: Injector,
  ) {
    super(injector, 'ShoppingList');
  }

  protected convertFromDbFormat(dbFormat) {
    const convertedFromDb = Object.assign(new ShoppingList(this), dbFormat);
    return convertedFromDb
  }

}
