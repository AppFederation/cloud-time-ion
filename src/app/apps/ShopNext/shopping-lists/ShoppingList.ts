import {OdmItem__OLD__} from "../../../libs/AppFedShared/odm/OdmItem__OLD__";
import {ShoppingListsService} from "./shopping-lists.service";

export class ShoppingList extends OdmItem__OLD__<ShoppingList> {
  constructor(
    odmService: ShoppingListsService,
    public title: string,
  ) {
    super(odmService)
  }

}
