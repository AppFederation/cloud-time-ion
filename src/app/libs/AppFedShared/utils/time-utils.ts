import {DurationMs, TimeMsEpoch} from './type-utils'

export function getEndOfDay() {
  // return new
}

export function hoursAsMs(hours: number): DurationMs {
  return hours * 3600 * 1000;
}

export function isInFuture(timeMsEpoch: TimeMsEpoch) {
  return timeMsEpoch > Date.now();
}

