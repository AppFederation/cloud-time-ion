import {Dict, dictToArrayWithIds} from '../../libs/AppFedShared/utils/dictionary-utils'

export type SideId = string

export class Side {
  id: SideId
  /* could be overridden per card or per-user; e.g. some titles could be in german, others in English */
  defaultLang: string
}


/*
 stuff like Artikel, example as extra fields.
 Array with multiple words for the same meaning.
 Each addressable for spaced repetition self-rating.
* */

export const sidesDefs = {
  title: {
    defaultLang: 'en-US'
  },
  question: {
    defaultLang: 'en-US'
  },
  answer: {
    defaultLang: 'en-US'
  },
  de: {
    defaultLang: 'de-DE'
  },
  en: {
    defaultLang: 'en-US'
  },
  es: {
    defaultLang: 'es-ES'
  },
  pl: {
    defaultLang: 'pl-PL'
  },
}

export const sidesDefsArray = dictToArrayWithIds(sidesDefs as any as Dict<Side>)
