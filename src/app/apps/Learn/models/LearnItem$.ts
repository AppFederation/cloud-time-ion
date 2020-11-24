import {OdmItem$2} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {LearnDoService} from '../core/learn-do.service'
import {NumericPickerVal} from '../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {OdmBackend} from '../../../libs/AppFedShared/odm/OdmBackend'
import {ImportanceId, ImportanceVal, LearnItem} from './LearnItem'
import {IntensityDescriptors} from './fields/intensity.model'
import {ImportanceDescriptor, ImportanceDescriptors, importanceDescriptors, importanceDescriptors2} from './fields/importance.model'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {Distribution} from '../../../libs/AppFedShared/utils/numbers/distributions/distribution'
import {Quiz, Quizzable$} from './quiz'
import {debugLog} from '../../../libs/AppFedShared/utils/log'
import {funLevelsDescriptors, FunLevelVal} from './fields/fun-level.model'
import {mentalEffortLevels, mentalEffortLevelsDescriptors} from './fields/mental-effort-level.model'
import {isNullishOrEmptyOrBlank} from '../../../libs/AppFedShared/utils/utils'

// export class Quiz {
//   // status$: {
//   //   whenNextRepetition: Date
//   //   isInFuture: boolean
//   // }
// }

export class LearnItem$
  extends OdmItem$2<
      LearnItem$,
      LearnItem,
      LearnItem,
      LearnDoService>
  implements Quizzable$
{
  quiz = new Quiz(this) // medium-coupling?

  // TODO: operations should actually be performed on certain Version, for versioning, drafts, branches, conflict detection/resolution

  setNewSelfRating(newSelfRatingFromUser: NumericPickerVal) {
    const item = this.currentVal
    const previousRating = item?.lastSelfRating // ?? 0
    let newEffectiveRating = newSelfRatingFromUser
    // repeatedly self-rating as 2 or 2.5, increases effective rating (confidence) :
    if (newEffectiveRating >= 2 /* in case of 2.5 (click 2 times) */ && (previousRating ?? 0) >= 2) {
      const enoughTimePassed = true // TODO: based on calculation
      if (enoughTimePassed) {
        const increaseBy = (newSelfRatingFromUser < 2.5) ? 1 : 2
        newEffectiveRating = previousRating ! + increaseBy
      }
    }

    this.patchThrottled({
      lastSelfRating: newEffectiveRating,
      whenLastSelfRated: OdmBackend.nowTimestamp(),
      selfRatingsCount: (item?.selfRatingsCount || 0) + 1,
    })

  }

  /* TODO return descriptor always */
  getEffectiveImportance(): ImportanceVal {
    return this.val ?. importance
      ?? this.getImportanceFromCategories()
      ?? importanceDescriptors.undefined
  }

  getEffectiveImportanceNumeric(): number {
    return ( this.val ?. importance ?? importanceDescriptors.medium ) ?. numeric
  }

  getEffectiveFunLevel(): FunLevelVal {
    return this.val ?. funEstimate ?? funLevelsDescriptors.descriptors.undefined
    // return this.importance // ?? maybe return medium
  }

  getEffectiveMentalEffort() {
    return this.val ?. mentalLevelEstimate ?? mentalEffortLevels.undefined
    // return this.importance // ?? maybe return medium
  }

  // TODO: start introducing item$.task.smth() for middle coupling (but not for general stuff like importance)

  getEffectiveRoi(): Distribution | undefined {
    return this.val ?. getRoi()
    // return 999 // FIXME
    // return this.importance // ?? maybe return medium
  }

  getEffectiveImportanceId(): ImportanceId {
    return this.getEffectiveImportance() ?. id
  }

  getEffectiveImportanceShortId() {
    return importanceDescriptors2.getShortId(this.getEffectiveImportance())
  }

  getEffectiveFunShortId(): string {
    return funLevelsDescriptors.getShortId(this.getEffectiveFunLevel())
  }

  getEffectiveMentalLevelShortId(): string {
    return mentalEffortLevelsDescriptors.getShortId(this.getEffectiveMentalEffort())
  }

  private getEffectiveImportanceByCategories() {
    if ( ! isNullishOrEmptyOrBlank(this.val?.de) ) {
      return importanceDescriptors.low // quick hack; TODO: read importance from category items and find max
    }
  }
}
