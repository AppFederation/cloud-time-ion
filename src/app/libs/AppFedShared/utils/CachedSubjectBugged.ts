// import {ReplaySubject} from "rxjs";
//
// /* !!!!! NOTE: for some reason it does not seem to fire when subscribed after value was next-ed.
// * use '../utils/cachedSubject2/CachedSubject2' instead
// *  */
// export class CachedSubjectBugged<T> extends ReplaySubject<T> {
//
//   public lastVal ? : T
//
//   /** Useful for e.g. determining in UI if initial data set has arrived (distinguish from initial empty) */
//   public hasEmitted = false
//
//   constructor(initialVal?: T) {
//     super(1)
//     this.lastVal = initialVal
//     /* !!! HACK because .next apparently cannot be overridden via TypeScript class method */
//     this.next = (val: T) => { this.nextWithCache(val) }
//   }
//
//   public next(val: T) {
//     this.lastVal = val
//     super.next(val)
//     this.hasEmitted = true
//   }
//
//   public nextWithCache(val: T) {
//     this.lastVal = val
//     super.next(val)
//     this.hasEmitted = true
//   }
//
// }
