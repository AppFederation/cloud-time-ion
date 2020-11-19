import {Dict, dictToArrayWithIds} from '../../../../libs/AppFedShared/utils/dictionary-utils'
import {IntensityVal} from '../LearnItem'
import {funLevelsDescriptors} from './fun-level.model'
import {IntensityDescriptor, IntensityDescriptors} from './intensity.model'
import {errorAlert} from '../../../../libs/AppFedShared/utils/log'

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

  getShortId(val: IntensityVal): string {
    return this.getDescriptorFromVal(val).shortId
  }

  getDescriptorFromVal(val: IntensityVal): TDescriptor {
    const descriptor = this.descriptors[val.id /* later I can store & use shortId as id */]
    if ( ! descriptor ) {
      errorAlert(`getDescriptorFromVal cannot get descriptor for value `, val)
    }
    return descriptor
  }

  getWithUnderscoreSuffix(val: IntensityVal): string {
    return this.getShortId(val) + '_' + this.suffix
  }
}
