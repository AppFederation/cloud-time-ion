import {IntensityDescriptors} from './intensity.model'
import {Descriptors} from './descriptors'


export type FunLevelDescriptor = any

export class FunLevelDescriptors extends IntensityDescriptors<FunLevelDescriptor> {

}

export const funLevels = new FunLevelDescriptors()

export const funLevelsDescriptors = new Descriptors<FunLevelDescriptor>(
  funLevels,
)


// === old:

export class FunDescriptors {
  disgusting        = 0 // 0    BTN
  very_low          = 1 // 0.5
  low               = 2 // 1    BTN
  medium            = 5 // 1.5 // default when unspecified
  high              = 10 // 2   BTN
  very_high/*fun*/   = 20 /* just 4 times more than unspecified?? --> 10 times?
      20 times higher than very_low seems ok
   */ // 2.5 / 3
}
