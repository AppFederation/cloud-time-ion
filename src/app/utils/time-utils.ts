import { isEmpty } from './utils'

export function parseTimeToMinutes(val: string) {
  if ( isEmpty(val) ) {
    return null
  }
  val = val.trim().toLowerCase()
  if ( val.endsWith(`h`) ) {
    return parseFloat(val) * 60
  } else if ( val.endsWith(`s`) ) {
      return parseFloat(val) / 60
  } else {
    return parseFloat(val)
  }
}
