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

export function minutesToString(minutes: number) {
  minutes = Math.round(minutes * 100) / 100
  const hours = Math.floor(minutes / 60)
  const minutesUpTo60 = minutes % 60
  return (hours ? `${hours}h ` : ``) + `${minutesUpTo60}m`
}
