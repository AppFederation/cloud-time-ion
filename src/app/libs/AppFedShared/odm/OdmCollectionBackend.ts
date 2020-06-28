import {Injector} from "@angular/core";
import {OdmItemId} from "./OdmItemId";
import {OdmBackend} from "./OdmBackend";
import {CachedSubject} from "../utils/CachedSubject";

export abstract class OdmCollectionBackendListener<
  TRaw,
  TItemId extends OdmItemId<TRaw> = OdmItemId<TRaw>
  >
{
  abstract onAdded(addedItemId: TItemId, addedItemData: TRaw)
  abstract onModified(modifiedItemId: TItemId, modifiedItemData: TRaw)
  abstract onRemoved(removedItemId: TItemId)
  abstract onFinishedProcessingChangeSet()
}


export abstract class OdmCollectionBackend<
  TRaw,
  TItemId extends OdmItemId<TRaw> = OdmItemId<TRaw>
  > {

  listener: OdmCollectionBackendListener<TRaw>

  collectionBackendReady$ = this.odmBackend.backendReady$

  dbCollection$ = new CachedSubject<TRaw[]>([])

  protected constructor(
    protected injector: Injector,
    protected className: string,
    protected odmBackend: OdmBackend,
  ) {
  }

  abstract saveNowToDb(item: TRaw, id: string): Promise<any>

  abstract deleteWithoutConfirmation(itemId: OdmItemId)

  public setListener(listener: OdmCollectionBackendListener<TRaw, TItemId>) {
    this.listener = listener
  }

}
