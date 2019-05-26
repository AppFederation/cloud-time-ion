import {OdmItem} from "../../../libs/AppFedShared/odm/OdmItem";
import {ShoppingListsService} from "./shopping-lists.service";

export class ShoppingList extends OdmItem<ShoppingList> {
  constructor(
    odmService: ShoppingListsService,
    public title: string,
  ) {
    super(odmService)
  }

}
