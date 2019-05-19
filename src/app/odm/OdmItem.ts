/** Object-Document/Database Mapping item */
import {OdmService} from "./OdmService";
import {CachedSubject} from "../utils/CachedSubject";
import {throttleTimeWithLeadingTrailing} from "../utils/rxUtils";
import {OdmItemId} from "./OdmItemId";
import {debugLog} from "../utils/log";

export class OdmItem<T extends OdmItem<T>> {

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
      this.id = '' + this.odmService.className + new Date() // hack
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

  patchThrottled(patch: Partial<T>) {
    debugLog('patchThrottled ([save])', patch)
    Object.assign(this, patch)
    this.onModified()
    // this.localUserSavesToThrottle$.next(this.asT) // other code listens to this and throttles - saves
    this.localUserSavesToThrottle$.next(this.asT) // other code listens to this and throttles - saves
    this.locallyVisibleChanges$.next(this.asT) // other code listens to this and throttles - saves
    this.odmService.emitLocalItems()
  }

  patchNow(patch: Partial<T>) {
    Object.assign(this, patch)
    this.onModified()
    this.odmService.saveNowToDb(this.asT)
    this.locallyVisibleChanges$.next(this.asT) // other code listens to this and throttles - saves
    this.odmService.emitLocalItems()
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
    return dbFormat
  }

  onModified() {

  }

  applyDataFromDbAndEmit(incomingConverted: T) {
    Object.assign(this, incomingConverted)
    this.locallyVisibleChanges$.next(incomingConverted)
  }
}
