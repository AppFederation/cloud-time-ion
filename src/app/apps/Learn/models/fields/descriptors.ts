import {Dict, dictToArrayWithIds} from '../../../../libs/AppFedShared/utils/dictionary-utils'

/** Name: DescriptorsGROUP ? */
export class Descriptors<TDescriptor> {

  constructor(
    public readonly descriptors: Dict<TDescriptor>
  ) {
  }

  array = dictToArrayWithIds(this.descriptors as Dict<TDescriptor>)

  arrayFromHighest = this.array.slice().reverse()

}
