import {OdmItem} from "../../../libs/AppFedShared/odm/OdmItem";
import {ShoppingListsService} from "./shopping-lists.service";
import {ListItem} from "./ListItem";
import {OdmChildList} from "../../../libs/AppFedShared/odm/OdmChildList";
import {OdmChildListDefinition} from "../../../libs/AppFedShared/odm/OdmChildListDefinition";


export class ShoppingList extends OdmItem<ShoppingList> {

  /** many-to-many definition */
  static itemsListDefinition = new OdmChildListDefinition<ShoppingList, ListItem>(
    {
      inclusionsFieldNameInParent: 'childItems',
      inclusionsFieldNameInChild: 'parentLists',
    }
  )

  itemsList = ShoppingList.itemsListDefinition.createChildrenListForParent(this)

  constructor(
    odmService: ShoppingListsService,
    public title?: string,
  ) {
    super(odmService)
  }


  toDbFormat() {
    let toDbFormat = super.toDbFormat();
    delete toDbFormat.itemsList
    return toDbFormat
  }
}
