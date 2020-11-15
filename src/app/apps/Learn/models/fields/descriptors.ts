import {Dict, dictToArrayWithIds} from '../../../../libs/AppFedShared/utils/dictionary-utils'
import {IntensityVal} from '../LearnItem'
import {funLevelsDescriptors} from './fun-level.model'
import {IntensityDescriptor, IntensityDescriptors} from './intensity.model'

/** Name: DescriptorsGROUP ? */
export class Descriptors<TDescriptor extends IntensityDescriptor = IntensityDescriptor> {

  constructor(
    /** TODO rename to dict */
    public readonly descriptors: Dict<TDescriptor>,
    public readonly suffix: string,
  ) {
  }

  array = dictToArrayWithIds(this.descriptors as Dict<TDescriptor>)

  arrayFromHighest = this.array.slice().reverse()

  getWithUnderscoreSuffix(val: IntensityVal): string {
    return this.descriptors[val.id /* later I can store & use shortId as id */]
      .shortId + '_' + this.suffix
  }
}
