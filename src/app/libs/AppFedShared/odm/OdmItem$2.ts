/** Object-Document/Database Mapping item */
import {DictPatch, PatchableObservable, throttleTimeWithLeadingTrailing} from "../utils/rxUtils";
import {OdmItemId} from "./OdmItemId";
import {OdmService2} from './OdmService2'
import {OdmBackend, OdmTimestamp} from './OdmBackend'
import {CachedSubject} from '../utils/cachedSubject2/CachedSubject2'
import {nullish} from '../utils/type-utils'
import {appGlobals} from '../g'
import {OdmList$} from './odm-list$'
import {tap} from 'rxjs/operators'
import {getNowTimePointSuitableForId} from './utils'

export type UserId = string

export class OdmInMemItemWriteOnce {
  public whenCreated?: OdmTimestamp
  /** TODO maybe better status: 'normal'/null | 'del(eted)' | 'arch(ived)' - but also think of "other meaning of status", like "draft", "published" etc
   * and whenDeleted, whenArchived
   * */
  public isDeleted?: OdmTimestamp
  public owner?: UserId
  public parentIds?: string[]
}

export class OdmInMemItem extends OdmInMemItemWriteOnce {
  public whenLastModified?: OdmTimestamp
  public whereCreated?: any
}

export type OdmPatch<TData> = DictPatch<TData>

export interface ModificationOpts {
  dontSetWhenLastModified?: boolean
}

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
  TRawData /* TODO: maybe this does not have to be part of public interface */ extends OdmInMemItem /* workaround */, // = TInMemData,
  TItemListService extends
    OdmService2<TItemListService, TInMemData, TRawData, any /* workaround */>, // =
    // OdmService2<TInMemData, TRawData>,
  TItemId extends
    OdmItemId<TRawData> =
    OdmItemId<TRawData>,
  TMemPatch extends
    OdmPatch<TInMemData> =
    OdmPatch<TInMemData>,
  TRawPatch extends /* TODO: maybe this does not have to be part of public interface */
    OdmPatch<TRawData> =
    OdmPatch<TRawData>,
  TChild extends
    // typeof this =
    // typeof this
    TSelf =
    TSelf
>
  implements PatchableObservable<TInMemData | nullish, TMemPatch>
{

  /** consider renaming to just `val` or `data`; undefined means not yet loaded; null means deleted (or perhaps losing access, e.g. via changing permissions -> "No longer available"
   * or realizing we don't have access
   * or empty value arrived
   **/
  currentVal: TInMemData | nullish = undefined

  /** Has patch that has not yet had a call to backend DB API (as opposed to not having been synchronized via network) */
  hasPendingPatch = false


  get val() { return this.currentVal }

  get val$() { return this.locallyVisibleChanges$ }

  private resolveFuncPendingThrottled?: (value?: (PromiseLike<any> | any)) => void

  public locallyVisibleChanges$ = new CachedSubject<TInMemData | nullish>()
  public locallyVisibleChangesThrottled$ = new CachedSubject<TInMemData | nullish>()
  public localUserSavesToThrottle$ = new CachedSubject<TInMemData | nullish>(/* it's important it's undefined here; otherwise it would send writes to db on load */)
  // TODO: distinguish between own-data changes (e.g. just name surname) and nested collections data change; or nested collections should only be obtained by service directly, via another observable

  /** FIXME: encapsulate into OdmCollection<TSelf>, and unify with all-items-list?
   * This has `list` in name, so should only react to changes of the list itself (not object data contents
   * */
  public childrenList$ = new CachedSubject<TSelf[] | undefined>()

  public children$: OdmList$<TChild>
    = new OdmList$<TChild>()//new CachedSubject<TSelf[] | undefined>()

  public childrenListener?: any

  public treeDescendantsListener?: any

  public get throttleIntervalMs() { return this.odmService.throttleIntervalMs }

  constructor(
    public odmService: TItemListService,
    public id?: TItemId,
    initialInMemData?: TInMemData,
    public parents?: TSelf[]
  ) {
    console.log('parents', parents)
    if ( initialInMemData !== undefined ) {
      this.emitNewVal(initialInMemData)
      // TODO: this.hasPendingPatch = true ?

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
      this.hasPendingPatch = false
      this.resolveFuncPendingThrottledIfNecessary()
    }) as any /* TODO investigate after strict */)
    // this.onModified()

    // FIXME: weave parents into db data

    if ( parents ) {
      for (let parent of parents) {
        parent.onChildrenAddedLocally([this])
      }
    }

  }

  private setIdAndWhenCreatedIfNecessary() {
    this.currentVal ! . owner = this.odmService.authService.authUser$?.lastVal?.uid
    this.currentVal ! . whenCreated = this.currentVal ! . whenCreated || OdmBackend.nowTimestamp()
    /* FIXME move to smth like setMetadata(): */
    this.currentVal ! . parentIds = this.parents?.filter(
      p => p.id /* FIXME this is a hack if parent was not saved yet (didn't get id yet) */
    )?.map(p => p.id as string) ?? [] /* FIXME: on the loading/receiving side, the this.parents are not set in-mem? */

    if ( ! this.id ) {
      this.id = this.generateItemId()
      // this.currentVal.id = this.id
    }
  }

  private generateItemId(): TItemId {
    return ('' + this.odmService.className + "__" + getNowTimePointSuitableForId() + '_') as TItemId  // hack
  }

  patchThrottled(patch: TMemPatch, modificationOpts?: ModificationOpts) {
    this.currentVal ??= {} as TInMemData /* HACK - FIXME - test it - tree deep descendants disappeared?
      - might affect hasEmitted... / has initial data arrived
      FIXME: patching removes (does not store) parentIds and ancestorIds - started happening after rich text cell - need to store parents in a field when loading
     */
    convertUndefinedFieldValsToNull(patch)
    convertUndefinedFieldValsToNull(this.currentVal) // quick hack for undefined in importance
    // return; // HACK
    if ( ! this.resolveFuncPendingThrottled ) {
      const promise = new Promise((resolveFunc) => {
        this.resolveFuncPendingThrottled = resolveFunc
      })
      this.odmService.syncStatusService.handleSavingPromise(promise)
    }
    this.setIdAndWhenCreatedIfNecessary()
    this.setLastModifiedIfNecessary(modificationOpts) // before the patching, in case patch contains modification fields
    Object.assign(this.currentVal, patch) // patching the value locally, but current impl saves whole object to firestore
    this.hasPendingPatch = true

    // this.localUserSavesToThrottle$.next(this.asT) // other code listens to this and throttles - saves
    this.localUserSavesToThrottle$.next(this.currentVal) // other code listens to this and throttles - saves
    this.locallyVisibleChanges$.next(this.currentVal) // other code listens to this and throttles - saves
    /* TODO move to odmService.onPatched(this, patch) */
    this.odmService.emitLocalItems()
    this.odmService.itemHistoryService.onPatch(this, patch)
  }

  private setLastModifiedIfNecessary(modificationOpts: ModificationOpts | nullish ) {
    if ( ! ( modificationOpts?.dontSetWhenLastModified ?? false ) ) {
      this.setWhenLastModified()
      // TODO: move whereLastModified from service
    }
  }

  // patchFieldThrottled(fieldKey: keyof TInMemData, fieldPatch: TInMemData[fieldKey]) {
  // patchFieldThrottled(fieldKey: keyof TInMemData, fieldPatch: typeof TInMemData[fieldKey]) {
  // can I use T[P] ? as in: type ReadOnly = {   readonly [P in keyof T]: T[P] };
  // patchFieldThrottled(fieldKey: keyof TData, fieldPatch: (typeof this.fieldKey)) {
  //  // idea: patch level 1 and pass partial
  // }

  // TODO: patchFieldsDeeplyLevel1 -- deeply LEVEL 1 -- for type safety

  patchNow(patch: OdmPatch<TInMemData>, modificationOpts?: ModificationOpts) {
    this.setIdAndWhenCreatedIfNecessary()
    this.setLastModifiedIfNecessary(modificationOpts)
    Object.assign(this.currentVal, patch)
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
    let dbFormat: any = Object.assign({}, this.currentVal) as any as TRawData

    for ( let key of Object.keys(dbFormat) ) {
      if ( dbFormat[key] === undefined ) {
        dbFormat[key] = null // for Firestore
      }
    }

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

  setWhenLastModified() {
    // debugLog(`setWhenLastModified`, this)
    // console.trace(`setWhenLastModified`, this)
    this.currentVal ! . whenLastModified = OdmBackend.nowTimestamp()
  }

  applyDataFromDbAndEmit(incomingConverted: TInMemData) {
    console.error(`FIXME: applyDataFromDbAndEmit() - this should be really where canApplyDataToViewGivenColumnLocalEdits() protection stuff is done!! Though another protection is to prevent infinite loop in e.g. rich text edit -> FormControl -> (loop). But this could be a flag like \`isApplying = true\` or isCurrentlyPatchingFromLocalEdit, try-finally at UI COMPONENT level? And use monotonic clock?`)
    // Object.assign(this, incomingConverted) // TODO:
    this.emitNewVal(incomingConverted)
    this.parents = incomingConverted?.parentIds?.map(id => this.odmService.obtainItem$ById(id))
    console.error(`FIXME: set this.parents (otherwise they will be destroyed when patching). And this.parents$. Though, 2 sources of truth: inMemData and parents$. this.parents value: `, this.parents, this.getParentIds() )
  }

  private emitNewVal(newVal: TInMemData) {
    this.currentVal = newVal
    this.locallyVisibleChanges$.next(newVal)
  }

  /** Note: saveThrottled does not exist, because we prefer to use patch, for incremental saves of only the fields that have changed */
  saveNowToDb(modificationOpts?: ModificationOpts) {
    console.log(`saveNowToDb`)
    this.setIdAndWhenCreatedIfNecessary()
    this.setLastModifiedIfNecessary(modificationOpts)
    this.odmService.saveNowToDb(this)
    this.resolveFuncPendingThrottledIfNecessary()
  }

  public saveNowToDbIfNeeded() {
    if ( this.hasPendingPatch
      /* more like hasUserEnteredData */
    ) {
      this.saveNowToDb /* ...Force */()
    }
    // TODO: item$ ?. hasOrHadUserProvidedContent() --> "had" - for undo in text fields (for the text field to not disappear), and for deleting item via backspace like OrYoL will have, and prolly LifeSuite Categories
    // FIXME: check if has pending patches
  }


  private resolveFuncPendingThrottledIfNecessary() {
    if (this.resolveFuncPendingThrottled) {
      // console.log(`resolveFuncPendingThrottled()`)
      this.resolveFuncPendingThrottled?.(true)
      this.resolveFuncPendingThrottled = undefined
    }
  }

  public onChildrenAddedLocally(children: TSelf[]) {
    console.log('onChildrenAddedLocally', children)
    this.childrenList$.nextWithCache([
      ... (this.childrenList$.lastVal ?? []),
      ... children,
    ])
  }

  public requestLoadChildren() {
    console.log('requestLoadChildren', this.id)
    if ( this.childrenListener ) {
      return
    }
    /* FIXME: this is copy-paste from entire-collection loading */
    /* TODO: encapsulate into OdmCollection object ?
      children$, allItems$
    *   */
    const service = this.odmService
    const thisItem$ = this
    this.childrenListener = {
      onAdded(addedItemId: TItemId, addedItemRawData: TRawData) {

        let existingItem: TSelf | undefined = service.mapIdToItem$.get(addedItemId)
        // debugLog('setBackendListenerIfNecessary onAdded', service, ...arguments, 'service.itemsCount()', service.itemsCount())

        console.log(`requestLoadChildren, onAdded addedItemId parent: `, thisItem$.id, addedItemId, `existingItem?.val$?.hasEmitted`, existingItem?.val$?.hasEmitted)

        // service.obtainOdmItem$(addedItemId) TODO
        // if ( ! existingItem ) {
        if ( ! existingItem?.val$?.hasEmitted ) { /* FIXME: isn't this gonna cause it to never emit changes coming from another machine ? */
          // FIXME: this is is causing item to never load if subscribed via item details url early

          existingItem = service.obtainItem$ById(addedItemId)

          let items = service.localItems$.lastVal;
          // if ( ! existingItem /* FIXME: now existingItem always returns smth */ ) {
          //   existingItem = service.createOdmItem$ForExisting(addedItemId, service.convertFromDbFormat(addedItemRawData))// service.convertFromDbFormat(addedItemRawData); // FIXME this.
          // }

          existingItem!.applyDataFromDbAndEmit(service.convertFromDbFormat(addedItemRawData) !) /* emits here, screwing this `! emitted` condition */
          // FIXME: set parent(s)
          console.log(`requestLoadChildren, thisItem$.childrenList$.lastVal.push`, thisItem$.id, addedItemId)

          items!.push(existingItem)
        } // else: it was added locally as lag compensation, don't do anything, to not destroy potential local changes

        thisItem$.childrenList$.lastVal ??= []
        if ( ! thisItem$.childrenList$.lastVal.includes(existingItem !) ) {
          thisItem$.childrenList$.lastVal.push(existingItem!) /* FIXME: this out-of-band modification might confuse RxJS */
        }


        // } else {
        // errorAlert('onAdded item unexpectedly existed already: ' + addedItemId, existingItem, 'incoming data: ', addedItemRawData)
        // existingItem.applyDataFromDbAndEmit(service.convertFromDbFormat(addedItemRawData))
        // }
        // service.emitLocalItems() -- now handled by onFinishedProcessingChangeSet

      },
      onModified(modifiedItemId: TItemId, modifiedItemRawData: TRawData) {
        // debugLog('setBackendListenerIfNecessary onModified', ...arguments)
        let convertedItemData = service.convertFromDbFormat(modifiedItemRawData);
        let existingItem = service.obtainItem$ById(modifiedItemId)
        if (existingItem && existingItem.applyDataFromDbAndEmit) {
          existingItem.applyDataFromDbAndEmit(convertedItemData)
        } else {
          console.error('FIXME existingItem.applyDataFromDbAndEmit(convertedItemData)', existingItem, existingItem && existingItem.applyDataFromDbAndEmit)
        }
        // service.emitLocalItems() -- now handled by onFinishedProcessingChangeSet
      },
      onRemoved(removedItemId: TItemId) {
        /* FIXME: remove in childrenList$ */
        service.localItems$.lastVal = service.localItems$ !.lastVal !.filter(item => item.id !== removedItemId)
        // TODO: remove from map? but keep in mind this could be based on query result. Maybe better to have a weak map and do NOT remove manually
        // service.emitLocalItems() -- now handled by onFinishedProcessingChangeSet
      },
      onFinishedProcessingChangeSet() {
        console.log('onFinishedProcessingChangeSet() - thisItem$.childrenList$.lastVal', thisItem$.childrenList$.lastVal)
        thisItem$.childrenList$.lastVal ??= [] /* FIXME: only emit if changed ? */
        thisItem$.childrenList$.reEmit()
        service.emitLocalItems()
      },
    }

    this.odmService.odmCollectionBackend.loadChildrenOf(this.id !, this.childrenListener)
  }

  public requestLoadTreeDescendants() {
    console.log('requestLoadTreeDescendants', this.id)
    if ( this.treeDescendantsListener ) {
      return
    }
    /* FIXME: this is copy-paste from entire-collection loading */
    /* TODO: encapsulate into OdmCollection object ? ...
      children$, allItems$
    *   */
    const service = this.odmService
    const thisItem$ = this

    this.odmService.odmCollectionBackend.loadTreeDescendantsOf(this.id !, this.treeDescendantsListener)
  }


  public getParentIds(): TItemId[] {
    // check if parents are set correctly:
    if ( ! this.parents?.length && !this.isTreeRoot() ) {
      if ( appGlobals.feat.categoriesTree.showFixmes ) {
        console.error('Item$ has no parents, but is not root!', this)
      }
    }
    // FIXME: handle case where this.parents are nullish
    return (this.parents?.map(parent => parent.id! as TItemId)) ?? ([] as TItemId[])
  }

  public getAncestorIds(): TItemId[] {
    /* FIXME: consider case where we load a sub-tree - some parent-of-parent were not yet loaded;
      but we can use their `ancestorIds` from their data object, without even having to load the ancestors
    *   */

    const ancestorIds = [] as TItemId[]
    ancestorIds.push(... this.getParentIds())
    for ( let parentItem$ of this.parents ?? [] ) {
      const ancestorsOfParent: TItemId[] = parentItem$.getAncestorIds() as TItemId[]
      ancestorIds.push(... ancestorsOfParent)
    }

    return ancestorIds
  }

  /** Todo rename to distinguish actual root from tree-starting-at-item or visual root */
  private isTreeRoot() {
    return this.id === this.odmService.treeRootItemId
  }

  /** another name: selectField$P */
  getObservablePatchableForField<TKey extends keyof TInMemData>(fieldName: TKey): PatchableObservable<TInMemData[TKey] | nullish, TMemPatch[TKey] | nullish> {
    const odmItem$ = this
    const mapFunc = (val: TInMemData| nullish): TInMemData[TKey] | undefined => {
      // kinda like `select()` in ngrx
      return val?.[fieldName]
    }
    const cachedSubject = new CachedSubject<TInMemData[TKey] | nullish>(mapFunc(odmItem$.currentVal))
    this.val$.pipe(
      /* .map here? */
      tap((value) => {
        console.log(`getObservablePatchableForField cachedSubject value`, value)
        // Use the same mapping function to avoid duplicate code
        const transformedValue = mapFunc(value);
        console.log(`getObservablePatchableForField transformedValue`, transformedValue)
        cachedSubject.next(transformedValue); // Update mappedSubject with the transformed value
      })
    )/*.pipe()*/.subscribe();
    // toCachedSubject()
    // FIXME: cache this in a map per-field
    const po: PatchableObservable<TInMemData[TKey] | nullish> = {

      locallyVisibleChanges$: cachedSubject,

      patchThrottled(patch: TInMemData[TKey]) {
        console.log(`getObservablePatchableForField patchThrottled`, patch)
        const patch1 = {
          [fieldName]: patch
        } as unknown as TMemPatch /* here need to cast coz not all fields are patchable (not all are `keyof TMemPatch)*/
        odmItem$.patchThrottled(patch1)
      }
    }
    return po

  }

}
