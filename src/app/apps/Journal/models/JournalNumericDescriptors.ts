import {Dict, dictToArrayWithIds} from '../../../libs/AppFedShared/utils/dictionary-utils'
import {UiFieldDef} from './JournalTextDescriptors'

export interface ILateInit {
  lateInit()
}

export class JournalNumericDescriptor extends UiFieldDef {

}

function jnd(anti?: string | { subTitle: string}) {
  return new JournalNumericDescriptor()
}

export class UiFieldDefs {
}

/** TODO: each numerical descriptor should have a text comment (some sort of "..." or comment bubble button which would expand comment field) */
export class JournalNumericDescriptors extends UiFieldDefs {

  static instance = new JournalNumericDescriptors()

  importance = jnd({subTitle: `of this journal entry`})
  mood = jnd()
  hope = jnd()
  health = jnd()
  rest = jnd('tired')
  'sleep quality' = jnd()
  'sleep quantity' = jnd()
  relax = jnd('stressed')
  satisfaction = jnd('frustrated' /*?*/)
  productivity = jnd()
  // work quality
  // work quantity
  /** self-control? */
  discipline = jnd()
  cleanliness = jnd()
  grooming = jnd()
  order = jnd('chaos')
  focus = jnd('distraction')
  courage = jnd('fear') // / confidence ;; BUT courage is a kind of fearlessness even when lacking CONFIDENCE
  outcome_independence = jnd()
  confidence = jnd('doubts')
  music = jnd()
  long_term_thinking = jnd()
  rationality = jnd()
  mindfulness = jnd()
  alcohol = jnd()

  array = dictToArrayWithIds(this as any as Dict<JournalNumericDescriptor>)

}
