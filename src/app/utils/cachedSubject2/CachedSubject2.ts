import {Subject, Subscriber, Subscription} from 'rxjs';

/** Similar to ReplaySubject<T>, but storing only 1 previous cached value.
 * This version is implemented without using ReplaySubject internally. */
export class CachedSubject<T> extends Subject<T> {

  // private replaySubject = new ReplaySubject(1)

  public lastVal: T

  /** Useful for e.g. determining in UI if initial data set has arrived (distinguish from initial empty) */
  public hasEmitted = false

  constructor() {
    super()
  }

  public next(val: T) {
    this.lastVal = val
    this.hasEmitted = true
    super.next(val)
  }

  public _subscribe(subscriber: Subscriber<T>): Subscription {
    const subscription = super._subscribe(subscriber);
    if ( this.hasEmitted ) {
      subscriber.next(this.lastVal)
    }
    return subscription;
  }
}
