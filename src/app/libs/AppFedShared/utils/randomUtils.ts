import {sumBy} from 'lodash-es'

export function pickRandomWeighted<T>(
  arr: Array<[number, T]>
): T | undefined
{
  // console.log(`pickRandomWeighted`, arr)

  const random = Math.random() * sumBy(arr, item => item[0])

  let maxRange = 0
  for ( let item of arr ) {
    maxRange += item[0]
    if ( random <= maxRange ) {
      return item[1]
    }
  }


    // let left = 0
  // let right = arr.length - 1
  // while ( left < right ) {
  //   const item = arr[(right + left) / 2]
  //   if ( item[0] )
  // }
}
