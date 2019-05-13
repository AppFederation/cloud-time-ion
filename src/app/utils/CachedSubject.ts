import {ReplaySubject} from "rxjs/internal/ReplaySubject";

export class CachedSubject<T> extends ReplaySubject<T> {

  public lastVal: T

  /** Useful for e.g. determining in UI if initial data set has arrived (distinguish from initial empty) */
  public hasEmitted = false

  constructor(initialVal?: T) {
    super(1)
    this.lastVal = initialVal
  }

  public next(val: T) {
    this.lastVal = val
    super.next(val)
    this.hasEmitted = true
  }

}
