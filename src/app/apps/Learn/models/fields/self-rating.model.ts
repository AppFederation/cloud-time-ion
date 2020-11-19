export type Rating = number
export type SelfRating = Rating

export class SelfRatingDescriptors {
  none = 0
  little = 0.5 // or "bad"
  decent = 1
  good = 1.5
  very_good = 2.0
  obvious = 3 // or 2.5
}
