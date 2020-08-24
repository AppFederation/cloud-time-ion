import {DurationMs, TimeMsEpoch} from './type-utils'

// export function getEndOfDay() {
//   // return new
// }

export function hoursAsMs(hours: number): DurationMs {
  return hours * 3600_000;
}

export function minutesAsMs(minutes: number): DurationMs {
  return minutes * 60_000;
}

export function secondsAsMs(seconds: number): DurationMs {
  return seconds * 1000;
}

export function isInFuture(timeMsEpoch: TimeMsEpoch) {
  return timeMsEpoch > Date.now();
}

