import {nullish} from './type-utils'
import {isNullish} from './utils'
import {IdString} from '../odm/OdmItemId'

export function stripHtml(html?: string | nullish): string | nullish {
  if ( isNullish(html) ) {
    return html
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';

  // TODO: to consider: href links for searching
}

export function htmlToId(html: string | nullish): IdString | nullish {
  if ( isNullish(html) ) {
    return html
  }
  return stripHtml(html) ?. toLowerCase() ?. replace(/ /, '_') as IdString
}

export function convertToHtmlIfNeeded(htmlOrPlainString?: string | null) {
  if ( ! htmlOrPlainString ) {
    return htmlOrPlainString
  }
  if ( typeof htmlOrPlainString !== 'string' ) {
    return htmlOrPlainString
  }
  if ( ! htmlOrPlainString?.match(/^\s*<\w+>.*/) ) {
    // console.log('convertToHtmlIfNeeded is plaintext:', htmlOrPlainString)
    htmlOrPlainString = '<p></p>' /* just to mark it as html */ +
      htmlOrPlainString.replace?.(/\n/g, `<br>`)
  } else {
    // console.log('convertToHtmlIfNeeded is html:', htmlOrPlainString)
  }
  return htmlOrPlainString;
}


