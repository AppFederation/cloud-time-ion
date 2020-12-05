/** Object-Document/Database Mapping item */
import {DictPatch, PatchableObservable, throttleTimeWithLeadingTrailing} from "../utils/rxUtils";
import {OdmItemId} from "./OdmItemId";
import {debugLog, errorAlert} from "../utils/log";
import {OdmService2} from './OdmService2'
import {OdmBackend, OdmTimestamp} from './OdmBackend'
import {CachedSubject} from '../utils/cachedSubject2/CachedSubject2'
import {nullish} from '../utils/type-utils'

export type UserId = string

export class OdmInMemItemWriteOnce {
  public whenCreated?: OdmTimestamp
  public isDeleted?: OdmTimestamp
  public owner?: UserId
}

export class OdmInMemItem extends OdmInMemItemWriteOnce {
  public whenLastModified?: OdmTimestamp
}

export type OdmPatch<TData> = DictPatch<TData>

export function convertUndefinedFieldValsToNull(obj: any) {
  for ( let key of Object.keys(obj) ) {
    if ( obj[key] === undefined ) {
      obj[key] = null
    }
  }
  return obj
}

/** Maybe have another conversion like OdmItem$W - W meaning writable,
 * to not confuse with real observables; or another special char like EUR - editable, funny pun.
 * Need to have a pronounceable version, like is the case with $ -> Stream
 *
 * In CoDaDriS terms, OdmItem$2 would have been ObjectAtBranch (not Vlid - Vlid is just a wrapper around ItemId)
 * where branch is e.g. draft/published. And the $ listens to changes to the item on a particular branch.
 * */
export class OdmItem$2<
  TSelf extends OdmItem$2<any, any, any, any> /* workaround coz I don't know how to get this in TS*/,
  TInMemData extends OdmInMemItem,
  TRawData extends OdmInMemItem /* workaround */, // = TInMemData,
  TItemListService extends
    OdmService2<TItemListService, TInMemData, TRawData, any /* workaround */>, // =
    // OdmService2<TInMemData, TRawData>,
  TItemId extends
    OdmItemId<TRawData> =
    OdmItemId<TRawData>,
  TMemPatch extends
    OdmPatch<TInMemData> =
    OdmPatch<TInMemData>,
  TRawPatch extends
    OdmPatch<TRawData> =
    OdmPatch<TRawData>,
  >
  implements PatchableObservable<TInMemData | nullish, TMemPatch>
{

  /** consider renaming to just `val` or `data`; undefined means not yet loaded; null means deleted (or perhaps losing access, e.g. via changing permissions -> "No longer available"
   * or realizing we don't have access
   * or empty value arrived
   **/
  currentVal: TInMemData | nullish = undefined


  get val() { return this.currentVal }

  get val$() { return this.locallyVisibleChanges$ }

  private resolveFuncPendingThrottled?: (value?: (PromiseLike<any> | any)) => void

  public locallyVisibleChanges$ = new CachedSubject<TInMemData | nullish>()
  public locallyVisibleChangesThrottled$ = new CachedSubject<TInMemData | nullish>()
  public localUserSavesToThrottle$ = new CachedSubject<TInMemData | nullish>()
  // TODO: distinguish between own-data changes (e.g. just name surname) and nested collections data change; or nested collections should only be obtained by service directly, via another observable

  public get throttleIntervalMs() { return this.odmService.throttleIntervalMs }

  constructor(
    public odmService: TItemListService,
    public id?: TItemId,
    initialInMemData?: TInMemData,
  ) {
    if ( initialInMemData ) {
      this.emitNewVal(initialInMemData)
      // DO NOT patch here, as it can create an infinite loop
      // this.patchNow(initialInMemData) // maybe should override rather than patch
    }

    this.localUserSavesToThrottle$.pipe(
      throttleTimeWithLeadingTrailing(this.odmService.throttleSaveToDbMs)
    ).subscribe(((value: TInMemData) => {
      /* why this works only once?
       * Causes saveNowToDb to receive old value
      // this.odmService.saveNowToDb(this as unknown as T)
      this.odmService.saveNowToDb(this.asT)
      */
      // FIXME: incremental patching
      this.odmService.saveNowToDb(this)
      this.resolveFuncPendingThrottledIfNecessary()
    }) as any /* TODO investigate after strict */)
    // this.onModified()
  }

  private setIdAndWhenCreatedIfNecessary() {
    this.currentVal ! . owner = this.odmService.authService.authUser$?.lastVal?.uid
    this.currentVal ! . whenCreated = this.currentVal ! . whenCreated || OdmBackend.nowTimestamp()
    if ( ! this.id ) {
      this.id = this.generateItemId()
      // this.currentVal.id = this.id
    }
  }

  private generateItemId(): TItemId {
    return ('' + this.odmService.className + "__" + new Date().toISOString()
      .replace('T', '__')
      .replace(/:/g, '.') + '_') as TItemId  // hack
  }

  patchThrottled(patch: TMemPatch) {
    convertUndefinedFieldValsToNull(patch)
    convertUndefinedFieldValsToNull(this.currentVal) // quick hack for undefined in importance
    // errorAlert(`patchThrottled is disabled coz of plain->html testing`, patch)
    // return; // HACK
    if ( ! this.resolveFuncPendingThrottled ) {
      const promise = new Promise((resolveFunc) => {
        this.resolveFuncPendingThrottled = resolveFunc
      })
      this.odmService.syncStatusService.handleSavingPromise(promise)
    }
    // console.log(`patchThrottled`)
    this.setIdAndWhenCreatedIfNecessary()
    // debugLog('patchThrottled ([save])', patch)
    Object.assign(this.currentVal, patch) // patching the value locally, but current impl saves whole object to firestore
    this.onModified()
    // console.log(`patchThrottled`)

    // this.localUserSavesToThrottle$.next(this.asT) // other code listens to this and throttles - saves
    this.localUserSavesToThrottle$.next(this.currentVal) // other code listens to this and throttles - saves
    this.locallyVisibleChanges$.next(this.currentVal) // other code listens to this and throttles - saves
    this.odmService.emitLocalItems()
    this.odmService.itemHistoryService.onPatch(this, patch)
  }

  // patchFieldThrottled(fieldKey: keyof TInMemData, fieldPatch: TInMemData[fieldKey]) {
  // patchFieldThrottled(fieldKey: keyof TInMemData, fieldPatch: typeof TInMemData[fieldKey]) {
  // can I use T[P] ? as in: type ReadOnly = {   readonly [P in keyof T]: T[P] };
  // patchFieldThrottled(fieldKey: keyof TData, fieldPatch: (typeof this.fieldKey)) {
  //  // idea: patch level 1 and pass partial
  // }

  // TODO: patchFieldsDeeplyLevel1 -- deeply LEVEL 1 -- for type safety

  patchNow(patch: OdmPatch<TInMemData>) {
    this.setIdAndWhenCreatedIfNecessary()
    Object.assign(this.currentVal, patch)
    this.onModified()
    this.odmService.saveNowToDb(this)
    this.resolveFuncPendingThrottledIfNecessary()
    this.locallyVisibleChanges$.next(this.currentVal) // other code listens to this and throttles - saves
    this.odmService.emitLocalItems()
  }

  deleteWithoutConfirmation() {
    this.currentVal ! . isDeleted = OdmBackend.nowTimestamp() // TODO: unused; check undefined
    this.odmService.deleteWithoutConfirmation(this)
  }

  /** Default impl, to be overridden */
  toDbFormat(): TRawData {
    let dbFormat = Object.assign({}, this.currentVal) as any as TRawData
    return dbFormat
    // return this.currentVal as any as TRawData
    // // delete dbFormat.odmService
    // // delete dbFormat.locallyVisibleChanges$
    // // delete dbFormat.locallyVisibleChangesThrottled$
    // // delete dbFormat.localUserSavesToThrottle$
    // if ( !dbFormat.isDeleted ) {
    //   delete dbFormat.isDeleted // For Firestore to avoid undefined
    // }
    // for ( let key of Object.keys(dbFormat) ) {
    //   if ( dbFormat[key] === undefined ) {
    //     delete dbFormat[key]
    //   }
    // }
    // // TODO: https://stackoverflow.com/questions/35055731/how-to-deeply-map-object-keys-with-javascript-lodash
    // // https://stackoverflow.com/questions/48156234/function-documentreference-set-called-with-invalid-data-unsupported-field-val
    // return dbFormat
  }

  onModified() {
    this.currentVal ! . whenLastModified = OdmBackend.nowTimestamp()
  }

  applyDataFromDbAndEmit(incomingConverted: TInMemData) {
    // Object.assign(this, incomingConverted) // TODO:
    this.emitNewVal(incomingConverted)
  }

  private emitNewVal(newVal: TInMemData) {
    this.currentVal = newVal
    this.locallyVisibleChanges$.next(newVal)
  }

  /** Note: saveThrottled does not exist, because we prefer to use patch, for incremental saves of only the fields that have changed */
  saveNowToDb() {
    this.setIdAndWhenCreatedIfNecessary()
    this.odmService.saveNowToDb(this)
    this.resolveFuncPendingThrottledIfNecessary()
  }

  private resolveFuncPendingThrottledIfNecessary() {
    if (this.resolveFuncPendingThrottled) {
      // console.log(`resolveFuncPendingThrottled()`)
      this.resolveFuncPendingThrottled?.(true)
      this.resolveFuncPendingThrottled = undefined
    }
  }
}
