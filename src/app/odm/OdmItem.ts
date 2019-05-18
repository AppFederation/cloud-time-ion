/** Object-Document/Database Mapping item */
import {OdmService} from "./OdmService";
import {CachedSubject} from "../utils/CachedSubject";
import {throttleTimeWithLeadingTrailing} from "../utils/rxUtils";
import {OdmItemId} from "./OdmItemId";

export class OdmItem<T extends OdmItem<T>> {

  public localChanges$ = new CachedSubject<T>(this.asT)

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
    this.localChanges$.pipe(throttleTimeWithLeadingTrailing(this.throttleIntervalMs)).subscribe(value => {
      this.odmService.saveNow(this.asT)
    })
    this.onModified()
  }

  patchThrottled(patch: Partial<T>) {
    Object.assign(this, patch)
    this.onModified()
    this.localChanges$.next(this.asT) // other code listens to this and throttles - saves
  }

  patchNow(patch: Partial<T>) {
    this.patchThrottled(patch) // TODO: make it really instant
  }

  deleteWithoutConfirmation() {
    this.isDeleted = new Date()
    this.odmService.deleteWithoutConfirmation(this.asT)
  }

  toDbFormat() {
    let dbFormat = Object.assign({}, this);
    delete dbFormat.odmService
    delete dbFormat.localChanges$
    if ( !dbFormat.isDeleted ) {
      delete dbFormat.isDeleted // For Firestore to avoid undefined
    }
    return dbFormat
  }

  onModified() {

  }
}
