import {Injectable, Injector} from '@angular/core';
import {OdmService} from "../../../libs/AppFedShared/odm/OdmService";
import {ListItem} from "./ListItem";

@Injectable({
  providedIn: 'root'
})
export class ShoppingListItemsService extends OdmService<ListItem> {

  constructor(
    injector: Injector,
  ) {
    super(injector, 'ListItem');
  }

}
