import {Subject, Subscriber, Subscription} from 'rxjs';
import {isNotNullish} from '../utils'

/** Similar to ReplaySubject<T>, but storing only 1 previous cached value.
 * This version is implemented without using ReplaySubject internally.
 * Provides easy access to last emitted value, via `lastVal`.
 */
export class CachedSubject<T> extends Subject<T> {

  // private replaySubject = new ReplaySubject(1)

  public lastVal ? : T

  /** Useful for e.g. determining in UI if initial data set has arrived (distinguish from initial empty) */
  public hasEmitted = false

  private onSubscribeCallBack ? : (subscriber: Subscriber<T>) => void

  constructor(initialVal ? : T) {
    super()
    if ( initialVal !== undefined ) {
      this.next(initialVal)
    }
  }

  public next(val: T) {
    this.lastVal = val
    this.hasEmitted = true
    super.next(val)
  }

  /** for compat with v1 */
  public nextWithCache(val: T) {
    return this.next(val)
  }

  public _subscribe(subscriber: Subscriber<T>): Subscription {
    const subscription = super._subscribe(subscriber);
    if ( this.hasEmitted ) {
      subscriber.next(this.lastVal)
    }
    this.onSubscribeCallBack ?. (subscriber)
    return subscription;
  }

  onSubscribe(callBack: () => void) {
    this.onSubscribeCallBack = callBack
    return this
  }

  /** HACK for emitting out-of-band value changes */
  reEmit() {
    this.next(this.lastVal !)
  }
}
