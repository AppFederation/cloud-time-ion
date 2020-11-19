import {Distribution2} from './distribution'

export function avg(min: number, max: number) {
  return (min + max) / 2
}




export class MinMidMaxDistribution<TNum extends number = number> extends Distribution2 {
  private min?: TNum
  private mid?: TNum
  private max?: TNum

  mostLikely(): TNum {
    if ( this.mid !== undefined ) {
      return this.mid
    }
    if ( this.min !== undefined && this.max !== undefined ) {
      return avg(this.min, this.max) as TNum
    }
    return (this.min ?? this.max) !
  }

}
