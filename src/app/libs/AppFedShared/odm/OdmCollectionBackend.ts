import {Injector} from "@angular/core";
import {OdmItemId} from "./OdmItemId";
import {OdmBackend} from "./OdmBackend";
import {CachedSubject} from '../utils/cachedSubject2/CachedSubject2'
import {AuthService} from '../../../auth/auth.service'

/* FIXME: unify with OdmItemId */
export type ItemId = string & { type: 'ItemId' }

export type QueryOpts = {
  limit?: number,
  fromLocalCache?: boolean,
  oneTimeGet: boolean,
}

export abstract class OdmCollectionBackendListener<
  TRaw,
  TItemId extends OdmItemId<TRaw> = OdmItemId<TRaw>
  >
{
  abstract onAdded(addedItemId: TItemId, addedItemData: TRaw): void
  abstract onModified(modifiedItemId: TItemId, modifiedItemData: TRaw): void
  abstract onRemoved(removedItemId: TItemId): void
  abstract onFinishedProcessingChangeSet(): void
}


export abstract class OdmCollectionBackend<
  TRaw,
  TItemId extends OdmItemId<TRaw> = OdmItemId<TRaw>
  > {

  listener ? : OdmCollectionBackendListener<TRaw>

  collectionBackendReady$ = this.odmBackend.backendReady$

  dbCollection$ = new CachedSubject<TRaw[]>([])

  authService = this.injector.get(AuthService)

  protected constructor(
    protected injector: Injector,
    protected className: string,
    protected odmBackend: OdmBackend,
  ) {
  }

  abstract saveNowToDb(
    item: TRaw,
    id: ItemId,
    parentIds?: ItemId[],
    ancestorIds?: ItemId[]
  ): Promise<any>

  abstract deleteWithoutConfirmation(itemId: OdmItemId): Promise<any>

  public setListener(listener: OdmCollectionBackendListener<TRaw, TItemId>, queryOpts: QueryOpts, callback: () => void): void
    /*: Promise<any> | undefined*/ {
    this.listener = listener
  }

  abstract loadChildrenOf(id: TItemId, listener: OdmCollectionBackendListener<TRaw>): void

  abstract loadTreeDescendantsOf(ancestorId: TItemId, listener: OdmCollectionBackendListener<TRaw>): void

}
