import {Dict, dictToArrayWithIds} from '../../../../libs/AppFedShared/utils/dictionary-utils'
import {IntensityDescriptors} from './intensity.model'
import {Descriptors} from './descriptors'
import {FunLevelDescriptor, funLevels} from './fun-level.model'

/* https://docs.google.com/spreadsheets/d/1ixSE37oAK9WnDKdq40VvR4vpODWYwcQmRNJ-3Cy6ZSo/edit#gid=3

// When I have projects, sub-tasks, I could have importance levels even like 1'000'000 times bigger (e.g. finishing of a big project; building company)
 */

export type ImportanceDescriptor = any

export type ImportanceDescriptors = IntensityDescriptors<ImportanceDescriptor>

export const importanceDescriptors: ImportanceDescriptors = new IntensityDescriptors()

export const importanceDescriptorsArray = dictToArrayWithIds(importanceDescriptors as Dict<ImportanceDescriptor>)

export const importanceDescriptorsArrayFromHighest = importanceDescriptorsArray.slice().reverse()

export const importanceDescriptors2 = new Descriptors<FunLevelDescriptor>(
  importanceDescriptors,
  'importance'
)

