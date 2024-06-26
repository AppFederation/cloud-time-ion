/** Object-Document/Database Mapping item */
import {OdmService_OLD} from "./OdmService_OLD";
// import {CachedSubjectBugged} from "../utils/CachedSubjectBugged";
import {throttleTimeWithLeadingTrailing} from "../utils/rxUtils";
import {OdmItemId} from "./OdmItemId";
import {debugLog} from "../utils/log";
import {CachedSubject} from '../utils/cachedSubject2/CachedSubject2'

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

/**
 * @deprecated
 */
export class OdmItem__OLD__<T extends OdmItem__OLD__<T>, TData = T> {

  public locallyVisibleChanges$ = new CachedSubject<T>(this.asT)
  public locallyVisibleChangesThrottled$ = new CachedSubject<T>(this.asT)
  public localUserSavesToThrottle$ = new CachedSubject<T>(this.asT)
  // TODO: distinguish between own-data changes (e.g. just name surname) and nested collections data change; or nested collections should only be obtained by service directly, via another observable

  public get asT() { return this as any as T}

  public get throttleIntervalMs() { return this.odmService.throttleIntervalMs }

  constructor(
    public odmService: OdmService_OLD<T>,
    public id?: OdmItemId<T>,
    public isDeleted?: Date,
    public whenCreated?: any,
    public whenLastModified?: any,
  ) {
    // do not call as we want timestamp of first write this.setIdIfNecessary()
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

  private setIdAndWhenCreatedIfNecessary() {
    this.whenCreated = this.whenCreated || new Date()
    if ( ! this.id ) {
      this.id = '' + this.odmService.className + "__" + new Date().toISOString()
        .replace('T', '__')
        .replace(/:/g, '.') + '_' // hack
    }
  }

  patchThrottled(patch: OdmPatch<TData>) {
    // console.log(`patchThrottled`)
    this.setIdAndWhenCreatedIfNecessary()
    // debugLog('patchThrottled ([save])', patch)
    Object.assign(this, patch)
    this.onModified()
    // this.localUserSavesToThrottle$.next(this.asT) // other code listens to this and throttles - saves
    this.localUserSavesToThrottle$.next(this.asT) // other code listens to this and throttles - saves
    this.locallyVisibleChanges$.next(this.asT) // other code listens to this and throttles - saves
    this.odmService.emitLocalItems()
  }

  // patchFieldThrottled(fieldKey: keyof TData, fieldPatch: (typeof this.fieldKey)) {
  //
  // }

  patchNow(patch: OdmPatch<TData>) {
    Object.assign(this, patch)
    this.onModified()
    this.odmService.saveNowToDb(this.asT)
    this.locallyVisibleChanges$.next(this.asT) // other code listens to this and throttles - saves
    this.odmService.emitLocalItems()
  }

  /* perhaps new approach: things are drafts by default, but can be promoted explicitly to published,
    e.g. even selected journal entries can be promoted to be published a'la blog.
    Shopping list items can be published after editing finished, to not distract e.g. spouse or coworker who is shopping,
    with not-yet-completely described items
  */
  patchDraftThrottled(patch: OdmPatch<TData>) {
    // TODO: distinguish draft
    this.patchThrottled(patch)
  }

  deleteWithoutConfirmation() {
    this.isDeleted = new Date()
    this.odmService.deleteWithoutConfirmation(this.asT)
  }

  toDbFormat(): TData {
    let dbFormat = Object.assign({}, this) as Partial<OdmItem__OLD__<any>>;
    delete dbFormat.odmService
    delete dbFormat.locallyVisibleChanges$
    delete dbFormat.locallyVisibleChangesThrottled$
    delete dbFormat.localUserSavesToThrottle$
    if ( !dbFormat.isDeleted ) {
      delete dbFormat.isDeleted // For Firestore to avoid undefined
    }
    for ( let key of Object.keys(dbFormat) ) {
      if ( (dbFormat as any) [key] === undefined ) {
        delete (dbFormat as any) [key]
      }
    }
    // TODO: https://stackoverflow.com/questions/35055731/how-to-deeply-map-object-keys-with-javascript-lodash
    // https://stackoverflow.com/questions/48156234/function-documentreference-set-called-with-invalid-data-unsupported-field-val
    return dbFormat as any as TData /* TODO: check */
  }

  onModified() {
    this.whenLastModified = new Date()
  }

  applyDataFromDbAndEmit(incomingConverted: T) {
    Object.assign(this, incomingConverted)
    this.locallyVisibleChanges$.next(incomingConverted)
  }

  /** Note: saveThrottled does not exist, because we prefer to use patch, for incremental saves of only the fields that have changed */
  saveNowToDb() {
    this.setIdAndWhenCreatedIfNecessary()
    this.odmService.saveNowToDb(this.asT)
  }

  publishDraft() {
    // FIXME
  }

  // public forkDraftItem(): OdmItem<T> {
  //   return null
  // }
}
