import {OdmItem} from "../../../libs/AppFedShared/odm/OdmItem";

/** Shopping list item */
export class ListItem extends OdmItem<ListItem> {
  title: string
  quantity: number
}
