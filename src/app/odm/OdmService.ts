import {Injector} from "@angular/core";
import {OdmBackend} from "./OdmBackend";
import {OdmItem} from "./OdmItem";
import {CachedSubject} from "../utils/CachedSubject";
import {debugLog} from "../utils/log";

export abstract class OdmService<T extends OdmItem<T>> {

  throttleIntervalMs = 500

  odmBackendFactory = this.injector.get(OdmBackend)
  odmCollectionBackend = this.odmBackendFactory.createCollectionBackend(this.injector, this.className)

  localItems$ = new CachedSubject<T[]>([])

  protected constructor(
    protected injector: Injector,
    public className: string,
  ) {
    this.odmCollectionBackend.dbCollection$.subscribe(dbCol => {
      let convertedCol = dbCol.map(dbItem => {
        return this.convertFromDbFormat(dbItem)
      });
      debugLog('localItems$.next')
      this.localItems$.next(convertedCol)
    })
  }

  deleteWithoutConfirmation(item: T) {
    this.odmCollectionBackend.deleteWithoutConfirmation(item.id)
  }

  saveNow(item: T) {
    this.odmCollectionBackend.saveNow(item)
  }

  protected convertFromDbFormat(dbItem: T) {
    return dbItem // default impl
  }
}
