import {debounceTime, throttleTime} from "rxjs/operators";
import {async} from "rxjs/internal/scheduler/async";
import {Observable} from 'rxjs/internal/Observable'
import {CachedSubject} from './cachedSubject2/CachedSubject2'
import {OdmPatch} from '../odm/OdmItem$2'

export function throttleTimeWithLeadingTrailing<T>(timeMs: number) {
  return debounceTime(timeMs)
}

export function throttleTimeWithLeadingTrailing_ReallyThrottle<T>(timeMs: number) {
  /* throttleTime appears to not work (fires immediately?)
    potentially related: https://github.com/ReactiveX/rxjs/issues/3712

    also sometimes last edit was not synced?
    But quiz status$ seems to work fine with throttle
   */
  // return throttleTime(timeMs)
  return throttleTime<T>(
    timeMs,
    async,
    {
      leading: true,
      trailing: true,
    }
  )
}

/** also: interface Patchable<TInMemVal> */

export interface PatchableObservable<TInMemData, TMemPatch = OdmPatch<TInMemData>> {

  locallyVisibleChanges$: CachedSubject<TInMemData | undefined | null>

  patchThrottled(patch: TMemPatch): void

}
