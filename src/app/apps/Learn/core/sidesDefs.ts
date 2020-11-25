import {Dict, dictToArrayWithIds} from '../../../libs/AppFedShared/utils/dictionary-utils'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'

export type SideId = keyof SidesDefs

export class Side {

  id ! : SideId
  _title ? : string
  /* could be overridden per card or per-user; e.g. some titles could be in german, others in English */
  defaultLang ? : string // = 'en-US'
  icon?: string
  flag?: string
  flagTransparent?: boolean
  dependsOn ? : Side
  isHint ? : boolean
  onlyForLearn ? : boolean
  hideByDefault ? : boolean

  get iconFullPath() {
    if ( ! this.icon ) {
      return undefined
    }
    return (this.icon?.startsWith(`assets/`) ? '' : `assets/icons/`)
      + this.icon
      // + (this.icon?.endsWith(`.svg`) ? '' : '.svg') cannot use now coz using ion-icon
  }

  /* TODO: rename to `question` */
  ask?: boolean // = true

  constructor() {
    if ( this.ask === undefined ) {
      this.ask = true // use `??`
    }
  }

  init() {
    if ( this.flag ) {
      this.icon ??= `assets/countries/` + this.flag + '.svg'
    }
    return this
  }

  get title () {
    return this._title ?? this.id ?. replace(/_/g, ' ')
  }
}

export type SideVal = string | nullish

export type SideDecl = Omit<Side, 'id'|'title' | 'init' | 'iconFullPath'> // TODO: Exclude<Omit<Side, 'id'|'title'>, Function>

/*
 stuff like Artikel, example as extra fields.
 Array with multiple words for the same meaning.
 Each addressable for spaced repetition self-rating.
* */

function side(param: SideDecl): Side {
  return Object.assign(new Side(), param).init()
}

const onlyForLearn = true
const hideByDefault = true

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
    onlyForLearn,
  })
  question3 = side({
    defaultLang: 'en-US',
    dependsOn: this.question2,
    onlyForLearn,
  })
  hint = side({
    isHint: true,
    onlyForLearn,
  })
  hint_2 = side({
    isHint: true,
    dependsOn: this.hint,
    onlyForLearn,
  })
  answer = side({
    defaultLang: 'en-US',
    ask: false,
  })
  description = side({
    ask: false,
  })
  /* first EN and PL to be more likely to ask from languages that I know already */
  examples = side({
  })
  comments = side({
    ask: false,
  })
  execution_hints = side({
    ask: false,
  })
  benefits = side({
    ask: false,
    icon: 'thumbs-up-outline',
  })
  requirements = side({
    ask: false,
  })
  time_estimate = side({
    icon: `stopwatch-outline`,
    _title: `~time`,
    ask: false,
  })
  money_estimate = side({
    ask: false,
  })
  status = side({
    ask: false,
  })
  percent_done = side({
    ask: false,
    _title: `% done`,
  })
  start_before = side({
    ask: false,
  })
  start_after = side({
    ask: false,
  })
  finish_before = side({
    ask: false,
    icon: `calendar-outline`,
  })
  finish_after = side({
    ask: false,
    icon: `calendar-outline`,
  })
  deps_to_start = side({
    ask: false,
  })
  deps_to_finish = side({
    ask: false,
  })
  pl = side({
    defaultLang: 'pl-PL',
    flag: `pl`,
    onlyForLearn
  })
  en = side({
    defaultLang: 'en-US',
    flag: `gb`,
    onlyForLearn
  })
  es_gender_article = side({
    defaultLang: 'es-ES',
    ask: false,
    flag: `es`,
    flagTransparent: true,
    onlyForLearn
  })
  es = side({
    defaultLang: 'es-ES',
    flag: `es`,
    onlyForLearn,
  })
  de_gender_article = side({
    defaultLang: 'de-DE',
    ask: false,
    flag: `de`,
    flagTransparent: true,
    onlyForLearn
  })
  de = side({
    defaultLang: 'de-DE',
    ask: false /* not asking German for now, to force recall */,
    flag: `de`,
    onlyForLearn
  })
  de_example = side({
    defaultLang: 'de-DE',
    ask: false /* not asking German for now, to force recall */,
    flag: `de`,
    flagTransparent: true,
    onlyForLearn
  })
  pt = side({
    defaultLang: 'pt-PT',
    ask: false /* not asking German for now, to force recall */,
    flag: `pt`,
    onlyForLearn,
    hideByDefault,
  })
  fr = side({
    defaultLang: 'fr-FR',
    ask: false /* not asking German for now, to force recall */,
    flag: `fr`,
    onlyForLearn,
    hideByDefault,
  })
  it = side({
    defaultLang: 'it-IT',
    ask: false /* not asking German for now, to force recall */,
    flag: `it`,
    onlyForLearn,
    hideByDefault,
  })
  nl = side({
    defaultLang: 'nl-NL',
    ask: false /* not asking German for now, to force recall */,
    flag: `nl`,
    onlyForLearn,
    hideByDefault,
  })
  ru = side({
    defaultLang: 'ru-RU',
    ask: false,
    flag: `ru`,
    hideByDefault,
    onlyForLearn,
  })
  cmn = side({
    defaultLang: 'cmn',
    ask: false,
    flag: `cn`,
    hideByDefault,
    onlyForLearn,
  })
  short_id = side({
    ask: false,
  })

  // IDEA: extra info that is not necessary for maximum self-rating ; could be ignored for scroll / buttons purposes
}

export const sidesDefs = new SidesDefs()

export const sidesDefsArray = dictToArrayWithIds(sidesDefs as any as Dict<Side>)

export const sidesDefsHintsArray = sidesDefsArray.filter(side => side.isHint)
