import {Dict, dictToArrayWithIds} from '../../../libs/AppFedShared/utils/dictionary-utils'
import {UiFieldDef} from './JournalTextDescriptors'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'

// idea: later group them into key elements that have to be in balance:
// e.g.:
// - productivity
// - excitement
// - responsibility

const isShortListed = true
const moderateIsBetter = true
const lowerIsBetter = true
const specifyDuration = true

export interface ILateInit {
  lateInit(): any
}

export interface ILateInitWithMorph<TMorphInto> {
  /** potentially can return another object into which it has "morphed" */
  lateInitAndMorph(): TMorphInto
}

export function includes(searchIn: string | string[] | nullish , searchStringPreprocessed: string): boolean | nullish {
  if ( typeof searchIn === `string` ) {
    return searchIn ?. toLowerCase() ?. includes(searchStringPreprocessed)
  } else {
    return searchIn ?. some(s => includes(s, searchStringPreprocessed))
  }
}

export class JournalNumericDescriptor extends UiFieldDef {

  isShortListed?: boolean

  searchTerms?: string | string[]

  antonym?: string | string[]

  acronym?: string | string[]


  get title() {
    return this.id
  }

  constructor(data?: JndParams) {
    super();

    Object.assign(this, data)
  }

  matchesSearch(search: string) {
    search = search ?. trim() ?. toLowerCase()
    if ( includes(this.antonym, search) ) {
      return true
    }
    return includes(this.id, search)
      || includes(this.searchTerms, search)
      || includes(this.acronym, search)
  }
}

type JndParams = {
  acronym?: string | string[],
  antonym?: string | string[],
  minLabel?: string,
  maxLabel?: string,
  subTitle?: string;
  unit?: string;
  lowerIsBetter?: true,
  moderateIsBetter?: true,
  specifyDuration ? : true,
  idealValue?: number,
  /* not yet implemented */
  searchTerms?: string | string[],
  isShortListed?: boolean,
}

function jnd(antonymOrData?: JndParams) {
  return new JournalNumericDescriptor(antonymOrData)
}

export class UiFieldDefs {
}

/* related to variable Belohnung */
export const slogans = [
  `It's like Ben Franklin's method, only better.`,
  `Play the Game of Life`,
  `What gets measured, gets managed. - Peter Drucker`,
  `Self-accountability`,
  `Don't lose track of... tracking.`,
  `To self-improve, You first need to self-assess.`,
  `Are You aware of Self-awareness?`,
  `A numeric self-rating is worth more than ... some quantity of words.`,
]

/** TODO: each numerical descriptor should have a text comment (some sort of "..." or comment bubble button which would expand comment field) */
export class JournalNumericDescriptors extends UiFieldDefs {

  static instance = new JournalNumericDescriptors()

  importance = jnd({subTitle: `of this journal entry`, minLabel: `routine`, maxLabel: `revolution`,
    isShortListed: true,
  })

  mood = jnd({
    searchTerms: [`happiness`, `happy`],
    antonym: [`sad`, `depressed`],
    isShortListed: true,
  })
  health = jnd({
    isShortListed: true,
  })
  pain = jnd({isShortListed: true})
  productivity = jnd({
    isShortListed: true,
    specifyDuration,
  })
  creativity = jnd()
  ideas = jnd()
  execution = jnd({
    specifyDuration,
  })
  procrastination = jnd({
    specifyDuration,
  })
  excitement = jnd({
    searchTerms: [ `enthusiasm`],
    idealValue: 8 /* excessive excitement can cause `tension` */,
    antonym: [`boredom?`, `apathy`],
    isShortListed: true,
    specifyDuration,
  })
  motivation = jnd({
    isShortListed: true,
  })
  ambition = jnd({
    searchTerms: [ `audacity`, `dreaming_big` ],
  })
  urgency = jnd()
  sense_of_urgency = jnd()
  patience = jnd({searchTerms: [`patient`]})
  achievements = jnd({
    isShortListed: true,
  })
  success = jnd({
    searchTerms: `achievement`
  }) /* prolly search term on achievements? */
  // !!! TODO: those could/should be the ones from my big virtuous circle drawing!!!

  /* ==== End of default shortlist of fields "to fill in a hurry".
    Here could be "show more button */

  'liking life' = jnd({searchTerms: [`life appreciation`, `gratefulness`]})
  'enjoyment of current activity' = jnd()
  'engagement' = jnd()
  'empathy' = jnd()
  'insensitivity' = jnd({moderateIsBetter: true, searchTerms: [`not give a fuck`]})
  'indifference' = jnd({moderateIsBetter: true})
  'assertiveness' = jnd()
  'flow state' = jnd({
    isShortListed: true,
    specifyDuration,
  })
  'self-esteem' = jnd({
    searchTerms: [`feeling of self-worth`, `self-respect`, `pride`],
    isShortListed: true,
  })
  /* TODO: esteem / respect from others, */
  guilt = jnd({lowerIsBetter: true}) /* mental state group */
  shame = jnd({lowerIsBetter: true}) /* mental state group */
  selfishness = jnd({lowerIsBetter: true, searchTerms: [`ego`, `egoism`], antonym: [`altruism`, `selflessness`]}) /* mental state group */
  competitiveness = jnd({moderateIsBetter: true}) /* mental state group */
  skill = jnd({})
  caution = jnd({moderateIsBetter: true, searchTerms: [`carefulness`], antonym: [`recklessness`, `carelessness`]})
  passion = jnd()
  adventure = jnd()
  exploration = jnd()
  travel = jnd()
  novelty = jnd()
  variety = jnd()
  'sense of wonder' = jnd()
  'peace of mind' = jnd({
    isShortListed: true,
  })
  /** TODO maybe merge with peace of mind */
  'calmness' = jnd({
    searchTerms: [`tranquility`],
    antonym: `drama`,
    specifyDuration
  })
  drama = jnd({lowerIsBetter, })
  'annoyance' = jnd({lowerIsBetter: true,})
  anger = jnd({lowerIsBetter: true, searchTerms: [`angry`, `pissed off`]})
  misanthropy = jnd({lowerIsBetter: true,})
  hate = jnd({lowerIsBetter: true,})
  love = jnd()
  modesty = jnd({antonym: [`hubris`, `arrogance`, `bragging`, `showing off`, `egomania`, `showoff`, `to show off`]})
  aggression = jnd({lowerIsBetter: true,})
  testosterone = jnd({moderateIsBetter: true})
  manliness = jnd({moderateIsBetter: true /* coz machismo ;) */})
  // TODO: feminine-ness...
  /** could be a search term on another one like calmness / resourcefulness */
  'overwhelm' = jnd({lowerIsBetter: true,})
  'resourcefulness' = jnd()
  'irritability' = jnd({lowerIsBetter: true,})
  determination = jnd({idealValue: 7.5,
    isShortListed: true,
    searchTerms: [`resolve`]
  })
  resilience = jnd({isShortListed: true})
  striving = jnd({isShortListed: true})
  strength = jnd({isShortListed: true})
  self_reliance = jnd({isShortListed: true})
  responsibility = jnd({isShortListed: true, searchTerms: [`responsableness`, `responsibleness`]})
  maturity = jnd({searchTerms: [`being grown up`]})
  reliability = jnd({isShortListed: true, searchTerms: [`trustworthiness`], antonym: [`flaky`, `flakiness`]})
  // TODO physical strength, mental strength
  // TODO power / influence
  energy = jnd({idealValue: 8.5,
    isShortListed: true,
    antonym: [`tiredness`, `tired`, `apathy`] /* Note: also in "rest" */
  })
  hypomania = jnd({moderateIsBetter: true})
  hope = jnd({
    isShortListed: true,
  })// merge optimism, hope?
  optimism = jnd({
    isShortListed: true,
  })
  reinterpretation = jnd({
    isShortListed: true,
  })
  progress = jnd({
    isShortListed: true,
  })
  momentum = jnd({
    isShortListed: true,
  })
  diet = jnd({
    searchTerms: ['nutrition', 'food', 'eating'],
    isShortListed: true,
  })
  overeating = jnd({
    searchTerms: ['gorging', 'food', 'eating too much'],
    isShortListed: true /* this will be personalised later */,
    lowerIsBetter: true,
  }) // other stuff for food/diet: eating sweets, eating junk foods, eating late/night
  rest = jnd({antonym: 'tired', searchTerms: [`Somnolence`, `sleepy` /* Note; someone searches sleepy, but the might want to distinguish tired */]})
  /** https://forum.wordreference.com/threads/drowsy-versus-sleepy.1010180/#post-14146420 */
  'sleepiness' = jnd({lowerIsBetter: true, searchTerms: [`drowsiness`, `drowsy`, `sleepy`, `Somnolence`]})
  'grogginess' = jnd({lowerIsBetter: true, searchTerms: [`groggy`]})
  'sleep quality' = jnd({
    isShortListed: true,
  })
  'sleep regularity' = jnd({searchTerms: `sleep pattern`})
  'sleep quantity' = jnd({
    specifyDuration,
    unit: 'hours',
  })
  caffeine = jnd({lowerIsBetter: true})
  coffee = jnd({lowerIsBetter: true})
  breathing = jnd({
    isShortListed: true,
  })
  relax = jnd({antonym: 'stressed'})
  satisfaction = jnd({antonym: 'frustrated'} /*?*/)
  frustration = jnd({antonym: 'frustrated'} /*?*/)
  fulfillment = jnd({searchTerms: [`fulfilment` /* single l */]})
  meaning = jnd()
  purpose = jnd()
  mission = jnd()
  cravings = jnd({
    lowerIsBetter: true,
  })
  'cravings for computer games' = jnd({
    lowerIsBetter: true,
  })
  'thinking_about_computer_games' = jnd({
    lowerIsBetter: true,
  })
  'cravings for food' = jnd({
    lowerIsBetter: true,
  })
  'cravings for alcohol' = jnd({
    lowerIsBetter: true,
  })
  'thinking_about_alcohol' = jnd({
    lowerIsBetter: true,
  })
  cognition = jnd({searchTerms: [`smart`, `intelligence`, `understanding`, `mental performance`]})
  thinking = jnd({searchTerms: [`smart`, `intelligence`, `understanding`, `mental performance`]})
  'work quality' = jnd()
  'work quantity' = jnd({idealValue: 8})
  /** self-control? ... self-discipline */
  discipline = jnd({
    isShortListed: true,
  })
  /** https://www.quora.com/Whats-the-difference-between-self-control-and-self-discipline */
  'self-discipline' = jnd()
  /** Self-discipline says go, and keep it going. Self-control is discipline in the face of pressure from an immediate urge, desire or compulsion. Self-control relates to delaying immediate gratification of the senses. Its struggle is the conflict between intellectual knowing and emotional desiring.Mar 29, 2003*/
  'self-control' = jnd()
  'self-restraint' = jnd({searchTerms: [`powściągliwość`, `moderation`]})
  'self-regulation' = jnd()
  'willpower' = jnd()
  /** **Will** Not **Want**: Self-Control Rather Than Motivation Explains the Female Advantage in Report Card Grades - https://pubmed.ncbi.nlm.nih.gov/25883522/*/
  'wanting' = jnd()
  routine = jnd({
    isShortListed: true,
  })
  day_routine = jnd()
  habits = jnd({
    isShortListed: true,
  })
  punctuality = jnd()
  cleanliness = jnd()
  obsessiveness = jnd()
  compulsions = jnd()
  grooming = jnd()
  order = jnd({antonym: 'chaos'})
  focus = jnd({
    antonym: `distraction`,
    searchTerms: [`distractions`],
    isShortListed: true,
    specifyDuration,
  })
  clarity = jnd({
    isShortListed: true,
  })
  'clear thinking' = jnd({
    isShortListed: true,
  })
  'brainstorming' = jnd({} /* part of thinking / problem solving / troubleshooting */)
  planning = jnd({
    specifyDuration,
  })
  prioritizing = jnd({})
  return_on_investment = jnd({acronym: `ROI`})
  'time tracking' = jnd()
  outcome_independence = jnd({isShortListed, acronym: `OI`})
  confidence = jnd({antonym: 'doubts'})
  'self-confidence' = jnd({
    antonym: 'doubts',
    isShortListed: true,
  })
  'music enjoyment' = jnd({
    specifyDuration,
  })
  'music quantity' = jnd({lowerIsBetter: true})
  'music volume' = jnd({lowerIsBetter: true})
  long_term_thinking = jnd()
  perspective = jnd()
  rationality = jnd()
  pragmatism = jnd({searchTerms: [`practical`]})
  /** note simple personal adjective */
  realistic = jnd()
  /** note simple personal adjective */
  smart = jnd({searchTerms: [`clever`], antonym: `stupid`})
  mindfulness = jnd({
    isShortListed: true,
  })
  moderation = jnd({searchTerms: [`junkie`], antonym: [`excess`, `binge`, `binging`]})
  addictions = jnd({lowerIsBetter})
  withdrawal_syndrome = jnd({lowerIsBetter})
  junkie = jnd({})
  desire = jnd({searchTerms: [`wanting`,  /* is it the same as desire? but for sure related */ /* but "desire" has some carnal/sexual connotations" */]})
  greed = jnd({moderateIsBetter: true})

  'delaying of gratification' = jnd()
  relationships = jnd({
    isShortListed: true,
  })
  relationships_with_friends = jnd()
  relationships_with_best_friends = jnd()
  relationships_with_partner = jnd()
  relationships_at_home = jnd()
  relationships_with_coworkers = jnd()
  relationships_with_family = jnd()
  relationships_with_close_family = jnd() // parents
  relationships_with_distant_family = jnd()
  alcohol = jnd({
    lowerIsBetter: true,
    specifyDuration,
  })
  hangover_intensity = jnd({lowerIsBetter: true,})
  'physical exercises' = jnd({
    isShortListed: true,
  })
  'physical fitness' = jnd({
    isShortListed: true,
  })
  /** TODO sport as sub-element of exercises */
  sport = jnd({
    isShortListed: true,
    specifyDuration,
  })
  bicycle = jnd({
    specifyDuration,
  })
  hiking = jnd({
    specifyDuration,
  })

  /*end sport subelements*/

  sex = jnd({moderateIsBetter: true,})
  weather = jnd()

  delegating = jnd()
  leadership = jnd()
  management = jnd()
  infrastructure = jnd()
  comfort = jnd({moderateIsBetter: true,})
  ergonomy = jnd({moderateIsBetter: true,})
  learning = jnd({
    isShortListed: true,
    specifyDuration,
  })
  memory = jnd()
  'memory recall' = jnd()
  'remembering' = jnd()
  gaming = jnd({
    unit: 'hours',
    lowerIsBetter: true,
    specifyDuration,
  })
  'skin itch' = jnd({
    lowerIsBetter: true,
  })
  'balance' = jnd()
  'harmony' = jnd()
  'allergy' = jnd()
  'food allergies' = jnd()
  freedom = jnd()

  worry = jnd({moderateIsBetter: true}) /* FIXME: de-duplicate; and with peace-of-mind */
  concern = jnd({moderateIsBetter: true}) /* FIXME: de-duplicate; and with peace-of-mind */
  anxiety = jnd({lowerIsBetter: true}) /* FIXME: de-duplicate; and with peace-of-mind */
  tension = jnd({lowerIsBetter: true}) /* FIXME: de-duplicate; and with peace-of-mind; related to excessive excitement */
  relief = jnd() /* FIXME: de-duplicate; and with peace-of-mind; related to excessive excitement */
  visualizing = jnd({moderateIsBetter: true})
  long_term_vision = jnd({moderateIsBetter: true, searchTerms: `long-term vision`})
  fun = jnd()
  entertainment = jnd({moderateIsBetter, specifyDuration})
  'guilt-free entertainment' = jnd({moderateIsBetter: true})
  'nostalgia' = jnd({moderateIsBetter: true})
  growth = jnd({
    isShortListed: true,
  })
  efficiency = jnd()
  effectiveness = jnd()

  social_interactions = jnd({searchTerms: ['interacting with people']})

  introspection = jnd()
  self_discovery = jnd()


  // Brian Tracy (No Excuses, chapter 2)
  courage = jnd({antonym: 'fear'}) // / confidence ;; BUT courage is a kind of fearlessness even when lacking CONFIDENCE
  character = jnd(/** group */)
  integrity = jnd()
  consistency = jnd()
  compassion = jnd()
  generosity = jnd()
  persistence = jnd()
  friendliness = jnd({searchTerms: ['being nice']})
  temperance = jnd()


  honesty = jnd()
  honor = jnd()
  goals = jnd(/* FIXME: this collides with text descriptor */)
  life_goals = jnd()
  written_goals = jnd()
  being_in_denial = jnd({lowerIsBetter})
  delusions = jnd({lowerIsBetter})
  delusions_of_grandeur = jnd({lowerIsBetter})


  // TODO: ego,
  // TODO pride


  array = dictToArrayWithIds(this as any as Dict<JournalNumericDescriptor>)

}
