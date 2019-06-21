import {Dict, dictToArrayWithIds} from '../../../libs/AppFedShared/utils/dictionary-utils'

export class JournalNumericDescriptor {
  id: string
}

function jnd(anti?: string) {
  return {}
}

/** TODO: each numerical descriptor should have a text comment (some sort of "..." or comment bubble button which would expand comment field) */
export class JournalNumericDescriptors {
  static array = dictToArrayWithIds(new JournalNumericDescriptors() as any as Dict<JournalNumericDescriptor>)

  mood = jnd()
  health = jnd()
  rest = jnd()
  hope = jnd()
  productivity = jnd()
  /** self-control? */
  discipline = jnd()
  cleanliness = jnd()
  grooming = jnd()
  order = jnd('chaos')
  longTermThinking = jnd()
}
