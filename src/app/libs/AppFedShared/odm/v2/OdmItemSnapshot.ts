import {OdmItemHandle} from './OdmItemHandle'
import {OdmCollectionService2} from './OdmCollectionService2'

/** Modification ops can only be done on snapshots, for later version control features, like branching, conflict detection */
export class OdmItemSnapshot<
  TRamItem,
  TRaw = TRamItem,
  THandle = OdmItemHandle<TRamItem>,
  TService = OdmCollectionService2<TRamItem, TRaw, THandle>,
  >
{
  constructor(
    public readonly itemHandle: THandle,
    public readonly data: TRamItem,
  ) {}
  // whenModified
  // isDraft

  patchThrottled() {

  }
}
