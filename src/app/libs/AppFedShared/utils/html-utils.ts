export function stripHtml(html?: string | null) {
  if ( ! html ) {
    return html
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';

  // TODO: to consider: href links for searching
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

