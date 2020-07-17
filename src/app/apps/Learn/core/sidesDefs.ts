import {Dict, dictToArrayWithIds} from '../../../libs/AppFedShared/utils/dictionary-utils'

export type SideId = string

export class Side {
  id ! : SideId
  /* could be overridden per card or per-user; e.g. some titles could be in german, others in English */
  defaultLang?: string // = 'en-US'
  flag?: string
  ask?: boolean // = true

  constructor() {
    if ( this.ask === undefined ) {
      this.ask = true // use `??`
    }
  }
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type SideDecl = Omit<Side, 'id'>

/*
 stuff like Artikel, example as extra fields.
 Array with multiple words for the same meaning.
 Each addressable for spaced repetition self-rating.
* */

function side(param: SideDecl): SideDecl {
  return Object.assign(new Side(), param)
}

export class SidesDefs {
  title = side({
    defaultLang: 'en-US',
  })
  question = side({
    defaultLang: 'en-US',
  })
  /** for a 2-way asking */
  question2 = side({
    defaultLang: 'en-US',
  })
  question3 = side({
    defaultLang: 'en-US',
  })
  answer = side({
    defaultLang: 'en-US',
    ask: false,
  })
  /* first EN and PL to be more likely to ask from languages that I know already */
  examples = side({
  })
  comments = side({
    ask: false,
  })
  pl = side({
    defaultLang: 'pl-PL',
    flag: `pl`,
  })
  en = side({
    defaultLang: 'en-US',
    flag: `gb`,
  })
  es_gender_article = side({
    defaultLang: 'es-ES',
    ask: false,
  })
  es = side({
    defaultLang: 'es-ES',
    flag: `es`,
  })
  de_gender_article = side({
    defaultLang: 'de-DE',
    ask: false,
  })
  de = side({
    defaultLang: 'de-DE',
    ask: false /* not asking German for now, to force recall */,
    flag: `de`,
  })
  pt = side({
    defaultLang: 'pt-PT',
    ask: false /* not asking German for now, to force recall */,
    flag: `pt`,
  })
  fr = side({
    defaultLang: 'fr-FR',
    ask: false /* not asking German for now, to force recall */,
    flag: `fr`,
  })
  it = side({
    defaultLang: 'it-IT',
    ask: false /* not asking German for now, to force recall */,
    flag: `it`,
  })
  nl = side({
    defaultLang: 'nl-NL',
    ask: false /* not asking German for now, to force recall */,
    flag: `nl`,
  })
}

export const sidesDefs = new SidesDefs()

export const sidesDefsArray = dictToArrayWithIds(sidesDefs as any as Dict<Side>)
