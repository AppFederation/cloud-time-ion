import {CachedSubject} from "../utils/CachedSubject";
import {OdmItemId} from "./OdmItemId";
import {OdmService} from "./OdmService";
import {OdmItem} from "./OdmItem";

export class OdmItemHandle<TItem extends OdmItem<TItem>> {
  readonly item$ = new CachedSubject<TItem>()

  constructor(
    public readonly odmService: OdmService<any>,
    public readonly itemId: OdmItemId<TItem>,
  ) {}
}
