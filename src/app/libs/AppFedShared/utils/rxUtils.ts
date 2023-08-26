import {debounceTime, throttleTime} from 'rxjs/operators';
import {async} from 'rxjs';
import {Observable} from 'rxjs'
import {CachedSubject} from './cachedSubject2/CachedSubject2'
import {OdmPatch} from '../odm/OdmItem$2'
import {DurationMs} from './type-utils'

export function throttleTimeWithLeadingTrailing<T>(timeMs: DurationMs) {
  return debounceTime(timeMs)
}

export function throttleTimeWithLeadingTrailing_ReallyThrottle<T>(timeMs: DurationMs) {
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

/** also: interface Patchable<TInMemVal>
 *
 * This a bit like Angular's FormControl, but smarter coz CachedSubject (later could be BehaviorSubject).
 * And better generic types?
 * Also, not depending on Angular.
 * THOUGH no validation here...
 * Though this could be partially taken from Angular FormControl
 *
 * Alternatively, I could make FormControl$ --- completely compatible with formControl but with val$ BehaviorSubject
 *
 * */
export type DictPatch<TData> = Partial<TData>

export interface PatchableObservable<TInMemData, TInMemPatch = DictPatch<TInMemData>> {

  locallyVisibleChanges$: CachedSubject<TInMemData>

  patchThrottled(patch: TInMemPatch): void

}
