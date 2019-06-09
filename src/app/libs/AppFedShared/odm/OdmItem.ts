/** Object-Document/Database Mapping item */
import {OdmService} from "./OdmService";
import {CachedSubject} from "../utils/CachedSubject";
import {throttleTimeWithLeadingTrailing} from "../utils/rxUtils";
import {OdmItemId} from "./OdmItemId";
import {debugLog} from "../utils/log";

/** A specific version of the ODM item.
 * OdmItemVersion ... */
export abstract class OdmItemData<TData> {
  /* domain-specific methods here too; so we operate from a particular version of an item, for handling conflicts
  * examples:
  * this.timerHandle.current.restart()
  * this.timer.current.restart()
  * hTimer -> storing in this.timer
  *
  * could also forward methods via Proxy to .current.*()
  *
  */
}

export type OdmPatch<TData> = Partial<TData>

export class OdmItem<T extends OdmItem<T>, TData = T> {

  public locallyVisibleChanges$ = new CachedSubject<T>(this.asT)
  public locallyVisibleChangesThrottled$ = new CachedSubject<T>(this.asT)
  public localUserSavesToThrottle$ = new CachedSubject<T>(this.asT)

  public get asT() { return this as unknown as T}

  public get throttleIntervalMs() { return this.odmService.throttleIntervalMs }

  constructor(
    public odmService: OdmService<T>,
    public id?: OdmItemId<T>,
    public isDeleted?: Date,
  ) {
    if ( !id ) {
      this.id = '' + this.odmService.className + "__" + new Date().toISOString()
        .replace('T', '_')
        .replace(/:/g, '.') + '_' // hack
    }
    this.localUserSavesToThrottle$.pipe(
      throttleTimeWithLeadingTrailing(this.odmService.throttleSaveToDbMs)
    ).subscribe(value => {
      /* why this works only once?
       * Causes saveNowToDb to receive old value
      // this.odmService.saveNowToDb(this as unknown as T)
      this.odmService.saveNowToDb(this.asT)
      */
      this.odmService.saveNowToDb(value as T)
    })
    this.onModified()
  }

  patchThrottled(patch: OdmPatch<TData>) {
    debugLog('patchThrottled ([save])', patch)
    Object.assign(this, patch)
    this.onModified()
    // this.localUserSavesToThrottle$.next(this.asT) // other code listens to this and throttles - saves
    this.localUserSavesToThrottle$.next(this.asT) // other code listens to this and throttles - saves
    this.locallyVisibleChanges$.next(this.asT) // other code listens to this and throttles - saves
    this.odmService.emitLocalItems()
  }

  patchNow(patch: OdmPatch<TData>) {
    Object.assign(this, patch)
    this.onModified()
    this.odmService.saveNowToDb(this.asT)
    this.locallyVisibleChanges$.next(this.asT) // other code listens to this and throttles - saves
    this.odmService.emitLocalItems()
  }

  patchDraftThrottled(patch: OdmPatch<TData>) {
    // TODO: distinguish draft
    this.patchThrottled(patch)
  }

  deleteWithoutConfirmation() {
    this.isDeleted = new Date()
    this.odmService.deleteWithoutConfirmation(this.asT)
  }

  toDbFormat() {
    let dbFormat = Object.assign({}, this);
    delete dbFormat.odmService
    delete dbFormat.locallyVisibleChanges$
    delete dbFormat.locallyVisibleChangesThrottled$
    delete dbFormat.localUserSavesToThrottle$
    if ( !dbFormat.isDeleted ) {
      delete dbFormat.isDeleted // For Firestore to avoid undefined
    }
    for ( let key of Object.keys(dbFormat) ) {
      if ( dbFormat[key] === undefined ) {
        delete dbFormat[key]
      }
    }
    // TODO: https://stackoverflow.com/questions/35055731/how-to-deeply-map-object-keys-with-javascript-lodash
    // https://stackoverflow.com/questions/48156234/function-documentreference-set-called-with-invalid-data-unsupported-field-val
    return dbFormat
  }

  onModified() {

  }

  applyDataFromDbAndEmit(incomingConverted: T) {
    Object.assign(this, incomingConverted)
    this.locallyVisibleChanges$.next(incomingConverted)
  }

  /** Note: saveThrottled does not exist, because we prefer to use patch, for incremental saves of only the fields that have changed */
  saveNowToDb() {
    this.odmService.saveNowToDb(this.asT)
  }

  publishDraft() {
    // FIXME
  }

  public forkDraftItem(): OdmItem<T> {
    return null
  }
}
