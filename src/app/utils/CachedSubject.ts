import {ReplaySubject} from "rxjs/internal/ReplaySubject";

export class CachedSubject<T> extends ReplaySubject<T> {

  public last: T

  constructor(initialVal?: T) {
    super(1)
    this.last = initialVal
  }

  public next(val: T) {
    this.last = val
    super.next(val)
  }

}
