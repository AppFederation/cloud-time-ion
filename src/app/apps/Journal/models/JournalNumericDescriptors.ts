import {Dict, dictToArrayWithIds} from '../../../libs/AppFedShared/utils/dictionary-utils'
import {UiFieldDef} from './JournalTextDescriptors'

export interface ILateInit {
  lateInit()
}

export class JournalNumericDescriptor extends UiFieldDef {

}

function jnd(antonym?: string | {
  antonym?: string,
  subTitle?: string;
  unit?: string;
  lowerIsBetter?: true,
  moderateIsBetter?: true,
  idealValue?: number,
  searchTerms?: string[],
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
  'self-esteem' = jnd()
  excitement = jnd()
  adventure = jnd()
  'peace of mind' = jnd()
  'calmness' = jnd()
  'annoyance' = jnd({lowerIsBetter: true,})
  'irritability' = jnd({lowerIsBetter: true,})
  motivation = jnd()
  determination = jnd()
  energy = jnd()
  hypomania = jnd({moderateIsBetter: true})
  hope = jnd()
  progress = jnd()
  health = jnd()
  diet = jnd({
    searchTerms: ['nutrition', 'food', 'eating']
  })
  rest = jnd('tired')
  'sleep quality' = jnd()
  'sleep quantity' = jnd({
    unit: 'hours',
  })
  breathing = jnd()
  relax = jnd('stressed')
  satisfaction = jnd('frustrated' /*?*/)
  meaning = jnd()
  purpose = jnd()
  cravings = jnd({
    lowerIsBetter: true,
  })
  productivity = jnd()
  'work quality' = jnd()
  'work quantity' = jnd({idealValue: 8})
  /** self-control? ... self-discipline */
  discipline = jnd()
  /** https://www.quora.com/Whats-the-difference-between-self-control-and-self-discipline */
  'self-discipline' = jnd()
  /** Self-discipline says go, and keep it going. Self-control is discipline in the face of pressure from an immediate urge, desire or compulsion. Self-control relates to delaying immediate gratification of the senses. Its struggle is the conflict between intellectual knowing and emotional desiring.Mar 29, 2003*/
  'self-control' = jnd()
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
  planning = jnd()
  'time tracking' = jnd()
  courage = jnd('fear') // / confidence ;; BUT courage is a kind of fearlessness even when lacking CONFIDENCE
  outcome_independence = jnd()
  confidence = jnd('doubts')
  music = jnd()
  long_term_thinking = jnd()
  rationality = jnd()
  mindfulness = jnd()
  moderation = jnd()
  'delaying of gratification' = jnd()
  relationships = jnd()
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


  array = dictToArrayWithIds(this as any as Dict<JournalNumericDescriptor>)

}
