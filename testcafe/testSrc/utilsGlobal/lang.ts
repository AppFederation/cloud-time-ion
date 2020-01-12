export var lang = 'es'

export function setLang(newLang: string) {
  lang = newLang
}

export function i18n(enText: string, esText: string) {
  // console.log('i18n lang', lang)
  if ( lang === `en` ) {
    return enText
  } else {
    return esText
  }
}
