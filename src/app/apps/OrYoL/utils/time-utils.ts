import {isEmpty} from '../../../libs/AppFedShared/utils/utils-from-oryol'

export function parseTimeToMinutes(val: string): number | null {
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

export function minutesToString(minutes: number): string {
  minutes = Math.round(minutes * 100) / 100
  const hours = Math.floor(minutes / 60)
  const minutesUpTo60 = minutes % 60
  return (hours ? `${hours}h ` : ``) + `${minutesUpTo60}m`
}
