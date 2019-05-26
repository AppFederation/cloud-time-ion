import {debounceTime, throttleTime} from "rxjs/operators";
import {async} from "rxjs/internal/scheduler/async";

export function throttleTimeWithLeadingTrailing<T>(timeMs: number) {
  return debounceTime(timeMs)
  /* throtleTime appears to not work (fires immediately?)
    potentially related: https://github.com/ReactiveX/rxjs/issues/3712
   */


  // return throttleTime(timeMs)
  // return throttleTime<T>(
  //   timeMs,
  //   async,
  //   {
  //     leading: true,
  //     trailing: true,
  //   }
  // )
}
