import {OdmService2} from './OdmService2'
import {OdmBackend} from './OdmBackend'
import {Injector} from '@angular/core'
import {OdmItemId} from './OdmItemId'
import {OdmItem$2} from './OdmItem$2'
import {debugLog} from '../utils/log'

export class HistoryItem$ extends OdmItem$2<any, any, any, any> {

}

/** TODO rename to ValueHistoryService?
 * To distinguish with incremental-changes ItemHistoryService ? */
export abstract class HistoryService<TInMem, TRaw = TInMem>
  extends OdmService2<HistoryService<TInMem, TRaw>,TInMem, TRaw, any> /* TODO: compose, not inherit, to not expose tons of unneeded methods maybe */
{
  constructor(
    injector: Injector,
    className: string,
  ) {
    super(injector, className, {
      dontLoadAllAutomatically: true,
      dontStoreWhenModified: true,
      dontStoreVersionHistory: true,
    })
  }

  public newValue(val: TInMem) {
    const toSave = {
      ...val
    } /* copy to avoid disturbing distinctUntilChanged */
    // (val as any).when = OdmBackend.nowTimestamp() // actually handled already: whenCreated
    // val.when = timestamp
    // TODO: throttle and distinctUntilChanged
    const histItem = new OdmItem$2(this as any, undefined, {})
    // debugLog(`HistoryService newValue`, val)
    histItem.patchNow(toSave)
    // this.createOdmItem$ForExisting(uuid)
  }

  protected createOdmItem$ForExisting(itemId: OdmItemId<TRaw>, inMemVal: TInMem | undefined): HistoryItem$ {
    return new HistoryItem$(this)
  }
  // throttle

}

// export class C {
//   c?: this
// }
