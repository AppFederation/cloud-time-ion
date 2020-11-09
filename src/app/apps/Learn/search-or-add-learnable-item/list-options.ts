import {LearnItem$} from '../models/LearnItem$'

export class ValueRestriction {

}


export class FieldFilter<TItem> {
  fieldName: keyof TItem

  // valueRestriction: ValueRestriction<> --> predicate
}

export class ListOptions {

  /** maybe scoring better?
   * But sort kinda handles scoring */
  filtersFns: (() => boolean)[] = []


  sortCompareFns: (() => number)[] = []

}

/* refactor into compareByField -- too error prone to accidentally use different fields */
const compareImportance = (item1: LearnItem$, item2: LearnItem$) => item1.getEffectiveImportance() - item2.getEffectiveImportance()
const compareRoi = (item1: LearnItem$, item2: LearnItem$) => item1.getEffectiveRoi() - item2.getEffectiveRoi()
const compareFunLevel = (item1: LearnItem$, item2: LearnItem$) => item1.getEffectiveFunLevel() - item2.getEffectiveFunLevel()

// const compareRecentlyModifiedOrAdded = (item1: LearnItem$, item2: LearnItem$) => // TODO item1.val?.whenLastModified - item2.getEffectiveFunLevel()

export const compareFnsImportanceRoi = [
  compareImportance,
  compareRoi,
]

export class ListPresets {
  importantQuickEasyFun = {
    filterFns: [
      // and()
    ]
  }
}
