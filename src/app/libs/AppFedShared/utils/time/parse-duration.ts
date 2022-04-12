import {DurationMs, nullish} from '../type-utils'
import {debugLog} from '../log'

export class ValueDistribution {
  constructor(
    public min: number,
    public mid: number,
    public max: number,
  ) {
  }

  add(distrib: ValueDistribution | nullish) {
    if ( distrib ) {
      this.min += (distrib.min || 0)
      this.mid += (distrib.mid || 0)
      this.max += (distrib.max || 0)
    }
  }
}

export function parseDurationToMs(s ? : string): DurationMs | nullish {
  // https://javascript.info/regexp-groups

  // FIXME: build the regex beforehand for performance
  if ( ! s ) {
    return undefined
  }
  s = s.trim()
  let match = s ?. match(/(\d+)\s*(h|hs|hrs|hour|hours)\b/i)
  if ( match ) {
    // debugLog(`parseDurationToMs match hours`, match)
    return (+match[1] ?? 0) * 3600_000
  }
  match = s ?. match(/(\d+)\s*(|m|min|mins|minutes)\b/i)
  if ( match ) {
    // debugLog(`parseDurationToMs match mins`, match)
    return (+match[1] ?? 0) * 60_000
  }
  // let match = s ?.match(/(\n)+\w*(h|hs|hrs|hours)?/gi)
}

function toMinutes(origString: string | nullish, num: string, unit: string) {
  if ( unit ?. match(/h|hs|hrs|hour|hours/i)) {
    return +num * 60
  }
  if ( ! unit || unit ?. match(/m|min|mins|minutes/i)) {
    return +num
  } else {
    console.warn('unknown unit', num, unit, origString)
    return +num
  }

}

export function parseTimeDistribution(s ? : string): ValueDistribution | undefined {
  // console.log('parseTimeDistribution')

  if ( ! s ) {
    return undefined
  }

  // const mins = `(?:m|min|mins|minutes)`
  // const hrs = `(?:h|hs|hrs|hour|hours)`
  // const num = `((\\d+)|(\\d+\\.\\d+))`
  // const num = /((\d+)|(\d+\.\d+))/
  // const dots = `\\s*\\.\\.\\.?\\s*`

  // s ?. match(/(\d+)\s*${mins}?\s*()(\d+)\s*${mins}?\b/i)

  // const unit = /(\w*)/

  // const r1 = num + /}\s*/ + unit + dots +
  // const r = [num, '', ]
  const regex = /(\d+(?:\.\d+)?)\s*(\w*)\s*(?:(?:\.\.\.?|--?)\s*(\d+(?:\.\d+)?)\s*(\w*)\s*(?:(?:\.\.\.?|--?)\s*(\d+(?:\.\d+)?)\s*(\w*)\s*)?)?/

  const matches = s. match(regex) ?? []
  // console.log(`parseTimeDistribution`, matches?.length, s, matches)
  let valueDistribution: ValueDistribution
  if ( matches [3] && matches [5]) {
    valueDistribution = new ValueDistribution(
      toMinutes(s, matches[1], matches[2] || matches[4] || matches[6]),
      toMinutes(s, matches[3], matches[4] || matches[6]),
      toMinutes(s, matches[5], matches[6]),
    )
  } else if ( matches [3] ){
    const min = toMinutes(s, matches[1], matches[2] || matches[4] || matches[6])
    const max = toMinutes(s, matches[3], matches[4])
    valueDistribution = new ValueDistribution(
      min,
      (min + max) / 2,
      max,
    )
  } else {
    const mid = toMinutes(s, matches[1], matches[2])
    valueDistribution = new ValueDistribution(
      mid,
      mid,
      mid,
    )
  }
  // console.log('valueDistribution', valueDistribution, s)
  return valueDistribution

}

