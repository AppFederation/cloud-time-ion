import {Dict, dictToArrayAssigningIds} from "../../../libs/AppFedShared/utils/dictionary-utils";

export class JournalTextDescriptor {
  id: string
}

function d() {
  return new JournalTextDescriptor()
}

export class JournalTextDescriptors {

  static array = dictToArrayAssigningIds(new JournalTextDescriptors() as any as Dict<JournalTextDescriptor>)

  general = d()
  positive = d()
  negative = d()
}
