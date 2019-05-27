import {CachedSubject} from "../utils/CachedSubject";

export abstract class OdmList<TItem, TRaw = TItem> {
  items$ = new CachedSubject<TItem[]>()

  abstract add(newItem: TItem)
}
