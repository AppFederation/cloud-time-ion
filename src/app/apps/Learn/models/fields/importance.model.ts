import {Dict, dictToArrayWithIds} from '../../../../libs/AppFedShared/utils/dictionary-utils'
import {IntensityDescriptors} from './intensity.model'

export type ImportanceDescriptor = any

export type ImportanceDescriptors = IntensityDescriptors<ImportanceDescriptor>

export const importanceDescriptors: ImportanceDescriptors = new IntensityDescriptors()

export const importanceDescriptorsArray = dictToArrayWithIds(importanceDescriptors as Dict<ImportanceDescriptor>)

export const importanceDescriptorsArrayFromHighest = importanceDescriptorsArray.slice().reverse()
