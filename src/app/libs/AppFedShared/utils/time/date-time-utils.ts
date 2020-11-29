import {DurationMs, TimeMsEpoch} from '../type-utils'

// export function getEndOfDay() {
//   // return new
// }

export function daysAsMs(hours: number): DurationMs {
  return hours * 24 * 3600_000 as DurationMs;
}

export function hoursAsMs(hours: number): DurationMs {
  return hours * 3600_000 as DurationMs;
}

export function minutesAsMs(minutes: number): DurationMs {
  return minutes * 60_000 as DurationMs;
}

export function secondsAsMs(seconds: number): DurationMs {
  return seconds * 1000 as DurationMs;
}

export function isInFuture(timeMsEpoch: TimeMsEpoch) {
  return timeMsEpoch > Date.now();
}

export function durationMs(ms: number) {
  return ms as number & {unit: 'ms'}
}

export function msElapsedTillNowSince(from: Date): DurationMs {
  return durationMs(Date.now() - from.getTime())
}

