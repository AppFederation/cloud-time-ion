import {Dict, dictToArrayWithIds} from '../../../libs/AppFedShared/utils/dictionary-utils'
import {UiFieldDef} from './JournalTextDescriptors'

export interface ILateInit {
  lateInit()
}

export class JournalNumericDescriptor extends UiFieldDef {

}

function jnd(anti?: string) {
  return new JournalNumericDescriptor()
}

class UiFieldDefs {
  array = dictToArrayWithIds(new JournalNumericDescriptors() as any as Dict<JournalNumericDescriptor>)
}

/** TODO: each numerical descriptor should have a text comment (some sort of "..." or comment bubble button which would expand comment field) */
export class JournalNumericDescriptors extends UiFieldDefs {

  static instance = new JournalNumericDescriptors()

  mood = jnd()
  hope = jnd()
  health = jnd()
  rest = jnd('tired')
  relax = jnd('stressed')
  satisfaction = jnd('frustrated' /*?*/)
  productivity = jnd()
  /** self-control? */
  discipline = jnd()
  cleanliness = jnd()
  grooming = jnd()
  order = jnd('chaos')
  long_term_thinking = jnd()
}
