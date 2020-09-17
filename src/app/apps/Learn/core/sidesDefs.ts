import {Dict, dictToArrayWithIds} from '../../../libs/AppFedShared/utils/dictionary-utils'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'

export type SideId = keyof SidesDefs

export class Side {

  id ! : SideId
  /* could be overridden per card or per-user; e.g. some titles could be in german, others in English */
  defaultLang?: string // = 'en-US'
  flag?: string
  flagTransparent?: boolean
  dependsOn? : Side

  /* TODO: rename to `question` */
  ask?: boolean // = true

  constructor() {
    if ( this.ask === undefined ) {
      this.ask = true // use `??`
    }
  }

  get title () {
    return this.id ?. replace(/_/g, ' ')
  }
}

export type SideVal = string | nullish

export type SideDecl = Omit<Side, 'id'|'title'>

/*
 stuff like Artikel, example as extra fields.
 Array with multiple words for the same meaning.
 Each addressable for spaced repetition self-rating.
* */

function side(param: SideDecl): Side {
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
    dependsOn: this.question,
  })
  question3 = side({
    defaultLang: 'en-US',
    dependsOn: this.question2
  })
  hint = side({
  })
  hint_2 = side({
    dependsOn: this.hint
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
    flag: `es`,
    flagTransparent: true,
  })
  es = side({
    defaultLang: 'es-ES',
    flag: `es`,
  })
  de_gender_article = side({
    defaultLang: 'de-DE',
    ask: false,
    flag: `de`,
    flagTransparent: true,
  })
  de = side({
    defaultLang: 'de-DE',
    ask: false /* not asking German for now, to force recall */,
    flag: `de`,
  })
  de_example = side({
    defaultLang: 'de-DE',
    ask: false /* not asking German for now, to force recall */,
    flag: `de`,
    flagTransparent: true,
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
  ru = side({
    defaultLang: 'ru-RU',
    ask: false,
    flag: `ru`,
  })
  cmn = side({
    defaultLang: 'cmn',
    ask: false,
    flag: `cn`,
  })
  // IDEA: extra info that is not necessary for maximum self-rating ; could be ignored for scroll / buttons purposes
}

export const sidesDefs = new SidesDefs()

export const sidesDefsArray = dictToArrayWithIds(sidesDefs as any as Dict<Side>)
