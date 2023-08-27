import {debounceTime, throttleTime} from 'rxjs/operators';
import {async} from 'rxjs';
import {Observable} from 'rxjs'
import {CachedSubject} from './cachedSubject2/CachedSubject2'
import {OdmPatch} from '../odm/OdmItem$2'
import {DurationMs} from './type-utils'
import {AbstractControl, FormControl} from '@angular/forms'
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject'

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

export type DictPatch<TData> = Partial<TData>


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
 * Big difference could be that PatchableObservable goes to/from DB "on its own" (automatically, it's its responsibility),
 * while FormControl does not have that responsibility?
 *
 * */
export interface PatchableObservable<TInMemData, TInMemPatch = DictPatch<TInMemData>> {

  locallyVisibleChanges$: CachedSubject<TInMemData>

  patchThrottled(patch: TInMemPatch): void

}

// export class OdmFormControl<T> extends /*FormControl<T> --- TS error about ctor */AbstractControl<T> {
//
//   val$: BehaviorSubject<T>
//
//   constructor(value: T) {
//     super([], value)
//     this.val$ = new BehaviorSubject<T>(value)
//     this.val$.next(value)
//     // TODO make sure it does not fire twice
//     this.valueChanges.subscribe(val=> {
//       this.val$.next(val)
//     })
//
//     // FIXME: patching should also update val$ but prolly automatic coz subscribed to valueChanges
//   }
// }
