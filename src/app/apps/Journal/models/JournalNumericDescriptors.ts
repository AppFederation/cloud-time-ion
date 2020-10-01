import {Dict, dictToArrayWithIds} from '../../../libs/AppFedShared/utils/dictionary-utils'
import {UiFieldDef} from './JournalTextDescriptors'

export interface ILateInit {
  lateInit(): any
}

export interface ILateInitWithMorph<TMorphInto> {
  /** potentially can return another object into which it has "morphed" */
  lateInitAndMorph(): TMorphInto
}

export class JournalNumericDescriptor extends UiFieldDef {
  isShortListed?: boolean

  get title() {
    return this.id
  }

  constructor(data?: JndParams) {
    super();

    Object.assign(this, data)
  }

  matchesSearch(search: string) {
    return this.id !. toLowerCase().includes(search.toLowerCase())
  }
}

type JndParams = {
  antonym?: string,
  minLabel?: string,
  maxLabel?: string,
  subTitle?: string;
  unit?: string;
  lowerIsBetter?: true,
  moderateIsBetter?: true,
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

/** TODO: each numerical descriptor should have a text comment (some sort of "..." or comment bubble button which would expand comment field) */
export class JournalNumericDescriptors extends UiFieldDefs {

  static instance = new JournalNumericDescriptors()

  importance = jnd({subTitle: `of this journal entry`, minLabel: `routine`, maxLabel: `revolution`,
    isShortListed: true,
  })

  mood = jnd({
    searchTerms: [`happiness`, `happy`],
    isShortListed: true,
  })
  health = jnd({
    isShortListed: true,
  })
  productivity = jnd({
    isShortListed: true,
  })
  creativity = jnd()
  ideas = jnd()
  execution = jnd()
  procrastination = jnd()
  excitement = jnd({
    antonym: `boredom?`,
    isShortListed: true,
  })
  motivation = jnd({
    isShortListed: true,
  })
  urgency = jnd()
  sense_of_urgency = jnd()
  achievements = jnd({
    isShortListed: true,
  })
  success = jnd() /* prolly search term on achievements? */
  // !!! TODO: those could/should be the ones from my big virtuous circle drawing!!!

  /* ==== End of default shortlist of fields "to fill in a hurry".
    Here could be "show more button */

  'liking life' = jnd({searchTerms: `life appreciation`})
  'enjoyment of current activity' = jnd()
  'engagement' = jnd()
  'empathy' = jnd()
  'insensitivity' = jnd({moderateIsBetter: true, searchTerms: [`not give a fuck`]})
  'indifference' = jnd({moderateIsBetter: true})
  'assertiveness' = jnd()
  'flow state' = jnd({
    isShortListed: true,
  })
  'self-esteem' = jnd({
    searchTerms: [`feeling of self-worth`, `self-respect`],
    isShortListed: true,
  })
  /* TODO: esteem / respect from others, */
  guilt = jnd({lowerIsBetter: true}) /* mental state group */
  shame = jnd({lowerIsBetter: true}) /* mental state group */
  passion = jnd()
  adventure = jnd()
  exploration = jnd()
  novelty = jnd()
  variety = jnd()
  'sense of wonder' = jnd()
  'peace of mind' = jnd({
    isShortListed: true,
  })
  'calmness' = jnd()
  'annoyance' = jnd({lowerIsBetter: true,})
  anger = jnd({lowerIsBetter: true,})
  hate = jnd({lowerIsBetter: true,})
  aggression = jnd({lowerIsBetter: true,})
  testosterone = jnd({moderateIsBetter: true})
  manliness = jnd({moderateIsBetter: true /* coz machismo ;) */})
  /** could be a search term on another one like calmness / resourcefulness */
  'overwhelm' = jnd({lowerIsBetter: true,})
  'resourcefulness' = jnd()
  'irritability' = jnd({lowerIsBetter: true,})
  determination = jnd({idealValue: 7.5,
    isShortListed: true,
  })
  energy = jnd({idealValue: 8.5,
    isShortListed: true,
  })
  hypomania = jnd({moderateIsBetter: true})
  hope = jnd({
    isShortListed: true,
  })
  optimism = jnd({
    isShortListed: true,
  })
  progress = jnd({
    isShortListed: true,
  })
  diet = jnd({
    searchTerms: ['nutrition', 'food', 'eating'],
    isShortListed: true,
  })
  rest = jnd({antonym: 'tired', searchTerms: [`Somnolence`, `sleepy` /* Note; someone searches sleepy, but the might want to distinguish tired */]})
  /** https://forum.wordreference.com/threads/drowsy-versus-sleepy.1010180/#post-14146420 */
  'sleepiness' = jnd({lowerIsBetter: true, searchTerms: [`drowsiness`, `drowsy`, `sleepy`, `Somnolence`]})
  'sleep quality' = jnd({
    isShortListed: true,
  })
  'sleep regularity' = jnd({searchTerms: `sleep pattern`})
  'sleep quantity' = jnd({
    unit: 'hours',
  })
  caffeine = jnd({lowerIsBetter: true})
  coffee = jnd({lowerIsBetter: true})
  breathing = jnd({
    isShortListed: true,
  })
  relax = jnd({antonym: 'stressed'})
  satisfaction = jnd({antonym: 'frustrated'} /*?*/)
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
  grooming = jnd()
  order = jnd({antonym: 'chaos'})
  focus = jnd({
    antonym: `distraction`,
    searchTerms: [`distractions`],
    isShortListed: true,
  })
  clarity = jnd({
    isShortListed: true,
  })
  'clear thinking' = jnd({
    isShortListed: true,
  })
  planning = jnd()
  'time tracking' = jnd()
  courage = jnd({antonym: 'fear'}) // / confidence ;; BUT courage is a kind of fearlessness even when lacking CONFIDENCE
  outcome_independence = jnd()
  confidence = jnd({antonym: 'doubts'})
  'self-confidence' = jnd({
    antonym: 'doubts',
    isShortListed: true,
  })
  'music enjoyment' = jnd()
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
  moderation = jnd({searchTerms: [`junkie`], antonym: `excess`})
  junkie = jnd({})
  desire = jnd({searchTerms: [`wanting`]})
  greed = jnd({})

  'delaying of gratification' = jnd()
  relationships = jnd({
    isShortListed: true,
  })
  relationships_with_friends = jnd()
  relationships_with_partner = jnd()
  relationships_at_home = jnd()
  relationships_with_coworkers = jnd()
  relationships_with_family = jnd()
  relationships_with_close_family = jnd()
  relationships_with_distant_family = jnd()
  alcohol = jnd({lowerIsBetter: true,})
  hangover_intensity = jnd({lowerIsBetter: true,})
  'physical exercises' = jnd({
    isShortListed: true,
  })
  sport = jnd({
    isShortListed: true,
  })
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
  })
  memory = jnd()
  'memory recall' = jnd()
  'remembering' = jnd()
  gaming = jnd({
    unit: 'hours',
    lowerIsBetter: true,
  })
  'skin itch' = jnd({
    lowerIsBetter: true,
  })
  'balance' = jnd()
  'allergy' = jnd()
  'food allergies' = jnd()
  freedom = jnd()

  worry = jnd({moderateIsBetter: true}) /* FIXME: de-duplicate; and with peace-of-mind */
  concern = jnd({moderateIsBetter: true}) /* FIXME: de-duplicate; and with peace-of-mind */
  anxiety = jnd({lowerIsBetter: true}) /* FIXME: de-duplicate; and with peace-of-mind */
  visualizing = jnd({moderateIsBetter: true})
  long_term_vision = jnd({moderateIsBetter: true, searchTerms: `long-term vision`})
  fun = jnd()
  entertainment = jnd({moderateIsBetter: true})
  'guilt-free entertainment' = jnd({moderateIsBetter: true})
  'nostalgia' = jnd({moderateIsBetter: true})
  growth = jnd({
    isShortListed: true,
  })


  array = dictToArrayWithIds(this as any as Dict<JournalNumericDescriptor>)

}
