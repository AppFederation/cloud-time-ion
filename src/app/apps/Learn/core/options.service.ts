import { Injectable } from '@angular/core';
import {DictPatch, PatchableObservable} from '../../../libs/AppFedShared/utils/rxUtils'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {patch} from '../../../libs/AppFedShared/utils/dictionary-utils'
import {debugLog} from '../../../libs/AppFedShared/utils/log'

export class LocalOptionsPatchableObservable<TOptions> implements PatchableObservable<TOptions> {

  get val() {
    return this.locallyVisibleChanges$.lastVal
  }

  constructor(
    public defaultValue: TOptions,
    public localStorageKey = 'LifeSuite_options'
  ) {
    this.locallyVisibleChanges$.next(JSON.parse(localStorage.getItem(localStorageKey) ?? '{}') ?? defaultValue)
  }


  locallyVisibleChanges$: CachedSubject<TOptions> = new CachedSubject<TOptions>({} as TOptions)

  patchThrottled(patchToApply: DictPatch<any>): void {
    this.locallyVisibleChanges$.next(patch(this.locallyVisibleChanges$.lastVal, patchToApply))
    debugLog(`localStorage.setItem`, patchToApply)
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.val))
  }

}

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  // options$ = new LocalOptionsPatchableObservable<LifeSuiteOptions>(
  //   new LifeSuiteOptions()
  // )

  // use PatchableObservable<TInMemData, TMemPatch> for bindability with ViewSyncer

  constructor(
  ) { }
}
