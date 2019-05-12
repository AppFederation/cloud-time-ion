import {throttleTime} from "rxjs/operators";

export function throttleTimeWithLeadingTrailing<T>(timeMs: number) {
  return throttleTime<T>(
    timeMs,
    undefined,
    {
      leading: true,
      trailing: true,
    }
  )
}
