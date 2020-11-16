import {IntensityDescriptors} from './intensity.model'
import {Descriptors} from './descriptors'


export type MentalEffortLevelDescriptor = any

export class MentalEffortLevelDescriptors extends IntensityDescriptors<MentalEffortLevelDescriptor> {

}

export const mentalEffortLevels = new MentalEffortLevelDescriptors()

export const mentalEffortLevelsDescriptors = new Descriptors<MentalEffortLevelDescriptor>(
  mentalEffortLevels,
  'mental',
)
