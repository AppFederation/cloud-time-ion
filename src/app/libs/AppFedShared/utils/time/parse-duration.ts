import {DurationMs, nullish} from '../type-utils'
import {debugLog} from '../log'

export function parseDurationToMs(s ? : string): DurationMs | nullish {
  // https://javascript.info/regexp-groups
  if ( ! s ) {
    return undefined
  }
  s = s.trim()
  let match = s ?. match(/(\d+)\s*(h|hs|hrs|hour|hours)\b/i)
  if ( match ) {
    // debugLog(`parseDurationToMs match hours`, match)
    return (+match[1] ?? 0) * 3600_000
  }
  match = s ?. match(/(\d+)\s*(m|min|mins|minutes)\b/i)
  if ( match ) {
    // debugLog(`parseDurationToMs match mins`, match)
    return (+match[1] ?? 0) * 60_000
  }
  // let match = s ?.match(/(\n)+\w*(h|hs|hrs|hours)?/gi)
}
