import {isNotNullishOrEmptyOrBlank} from '../utils'
import {nullish} from '../type-utils'

/** https://blog.logrocket.com/javascript-date-libraries/ - parseFormat
 * https://github.com/you-dont-need/You-Dont-Need-Momentjs
 * */
export function parseDate(string: string | nullish) {
  if ( isNotNullishOrEmptyOrBlank(string) ) {
    const dateMatch = string.match(/\d{4}-\d{2}-\d{2}/)
    if ( dateMatch ?. length ) {
      return new Date(dateMatch[0])
    }
  }
}
