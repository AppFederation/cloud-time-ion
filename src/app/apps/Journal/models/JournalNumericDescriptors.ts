import {Dict, dictToArrayWithIds} from '../../../libs/AppFedShared/utils/dictionary-utils'
import {UiFieldDef} from './JournalTextDescriptors'

export interface ILateInit {
  lateInit()
}

export class JournalNumericDescriptor extends UiFieldDef {

}

function jnd(antonymOrData?: string | {
  antonym?: string,
  subTitle?: string;
  unit?: string;
  lowerIsBetter?: true,
  moderateIsBetter?: true,
  idealValue?: number,
  searchTerms?: string | string[],
}) {
  return new JournalNumericDescriptor()
}

export class UiFieldDefs {
}

/** TODO: each numerical descriptor should have a text comment (some sort of "..." or comment bubble button which would expand comment field) */
export class JournalNumericDescriptors extends UiFieldDefs {

  static instance = new JournalNumericDescriptors()

  importance = jnd({subTitle: `of this journal entry`})

  mood = jnd()
  'liking life' = jnd({searchTerms: `life appreciation`})
  'enjoyment of current activity' = jnd()
  'engagement' = jnd()
  'empathy' = jnd()
  'insensitivity' = jnd({moderateIsBetter: true, searchTerms: [`not give a fuck`]})
  'indifference' = jnd({moderateIsBetter: true})
  'assertiveness' = jnd()
  'flow state' = jnd()
  'self-esteem' = jnd()
  /* TODO: esteem / respect from others, */
  guilt = jnd({lowerIsBetter: true}) /* mental state group */
  shame = jnd({lowerIsBetter: true}) /* mental state group */
  excitement = jnd()
  passion = jnd()
  adventure = jnd()
  exploration = jnd()
  novelty = jnd()
  variety = jnd()
  'sense of wonder' = jnd()
  'peace of mind' = jnd()
  'calmness' = jnd()
  'annoyance' = jnd({lowerIsBetter: true,})
  'irritability' = jnd({lowerIsBetter: true,})
  motivation = jnd()
  determination = jnd({idealValue: 7.5})
  energy = jnd({idealValue: 8.5})
  hypomania = jnd({moderateIsBetter: true})
  hope = jnd()
  optimism = jnd()
  progress = jnd()
  health = jnd()
  diet = jnd({
    searchTerms: ['nutrition', 'food', 'eating']
  })
  rest = jnd({antonym: 'tired', searchTerms: [`Somnolence`, `sleepy` /* Note; someone searches sleepy, but the might want to distinguish tired */]})
  /** https://forum.wordreference.com/threads/drowsy-versus-sleepy.1010180/#post-14146420 */
  'sleepiness' = jnd({lowerIsBetter: true, searchTerms: [`drowsiness`, `drowsy`, `sleepy`, `Somnolence`]})
  'sleep quality' = jnd()
  'sleep quantity' = jnd({
    unit: 'hours',
  })
  caffeine = jnd({lowerIsBetter: true})
  coffee = jnd({lowerIsBetter: true})
  breathing = jnd()
  relax = jnd('stressed')
  satisfaction = jnd('frustrated' /*?*/)
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
  'cravings for computer alcohol' = jnd({
    lowerIsBetter: true,
  })
  productivity = jnd()
  cognition = jnd({searchTerms: [`smart`, `intelligence`, `understanding`, `mental performance`]})
  thinking = jnd({searchTerms: [`smart`, `intelligence`, `understanding`, `mental performance`]})
  'work quality' = jnd()
  'work quantity' = jnd({idealValue: 8})
  /** self-control? ... self-discipline */
  discipline = jnd()
  /** https://www.quora.com/Whats-the-difference-between-self-control-and-self-discipline */
  'self-discipline' = jnd()
  /** Self-discipline says go, and keep it going. Self-control is discipline in the face of pressure from an immediate urge, desire or compulsion. Self-control relates to delaying immediate gratification of the senses. Its struggle is the conflict between intellectual knowing and emotional desiring.Mar 29, 2003*/
  'self-control' = jnd()
  'self-restraint' = jnd({searchTerms: [`powściągliwość`, `moderation`]})
  'self-regulation' = jnd()
  'willpower' = jnd()
  /** **Will** Not **Want**: Self-Control Rather Than Motivation Explains the Female Advantage in Report Card Grades - https://pubmed.ncbi.nlm.nih.gov/25883522/*/
  'wanting' = jnd()
  routine = jnd()
  habits = jnd()
  punctuality = jnd()
  cleanliness = jnd()
  grooming = jnd()
  order = jnd('chaos')
  focus = jnd('distraction')
  clarity = jnd()
  'clear thinking' = jnd()
  planning = jnd()
  'time tracking' = jnd()
  courage = jnd('fear') // / confidence ;; BUT courage is a kind of fearlessness even when lacking CONFIDENCE
  outcome_independence = jnd()
  confidence = jnd('doubts')
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
  mindfulness = jnd()
  moderation = jnd({searchTerms: [`junkie`], antonym: `excess`})
  junkie = jnd({})
  desire = jnd({searchTerms: [`wanting`]})
  greed = jnd({})

  'delaying of gratification' = jnd()
  relationships = jnd()
  relationships_with_friends = jnd()
  relationships_with_partner = jnd()
  relationships_at_home = jnd()
  relationships_with_coworkers = jnd()
  alcohol = jnd({lowerIsBetter: true,})
  'physical exercises' = jnd()
  sport = jnd()
  sex = jnd({moderateIsBetter: true,})
  weather = jnd()

  delegating = jnd()
  leadership = jnd()
  management = jnd()
  infrastructure = jnd()
  comfort = jnd({moderateIsBetter: true,})
  ergonomy = jnd({moderateIsBetter: true,})
  learning = jnd()
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

  worry = jnd({moderateIsBetter: true})
  concern = jnd({moderateIsBetter: true})
  anxiety = jnd({lowerIsBetter: true})
  visualizing = jnd({moderateIsBetter: true})
  fun = jnd()
  entertainment = jnd({moderateIsBetter: true})
  'guilt-free entertainment' = jnd({moderateIsBetter: true})


  array = dictToArrayWithIds(this as any as Dict<JournalNumericDescriptor>)

}
