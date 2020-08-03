import {OdmService2} from './OdmService2'
import {OdmBackend} from './OdmBackend'
import {Injector} from '@angular/core'
import {OdmItemId} from './OdmItemId'

export class HistoryService<TInMem, TRaw> extends OdmService2<HistoryService<TInMem, TRaw>,TInMem, TRaw, any>
{
  constructor(
    protected injector: Injector,
    public className: string,
  ) {
    super(injector, className)
  }

  public newValue(val: TInMem) {
    const timestamp = OdmBackend.nowTimestamp()
    // val.when = timestamp

  }

  protected createOdmItem$ForExisting(itemId: OdmItemId<TRaw>, inMemVal: TInMem | undefined): any {
  }
  // throttle

}

// export class C {
//   c?: this
// }
