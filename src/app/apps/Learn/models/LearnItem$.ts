import {OdmItem$2} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {LearnDoService} from '../core/learn-do.service'
import {NumericPickerVal} from '../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {OdmBackend} from '../../../libs/AppFedShared/odm/OdmBackend'
import {LearnItem} from './LearnItem'
import {IntensityDescriptors} from './fields/intensity.model'
import {ImportanceDescriptor, importanceDescriptors} from './fields/importance.model'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'

export class Quiz {
  // status$: {
  //   whenNextRepetition: Date
  //   isInFuture: boolean
  // }
}

export class LearnItem$
  extends OdmItem$2<LearnItem$, LearnItem, LearnItem, LearnDoService>
{
  quiz = new Quiz() // medium-coupling?

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

  getEffectiveImportance(): ImportanceDescriptor | nullish {
    return this.val ?. importance ?? importanceDescriptors.medium
  }

  getEffectiveFunLevel() {
    // return this.importance // ?? maybe return medium
  }

  getEffectiveMentalEffort() {
    // return this.importance // ?? maybe return medium
  }

  getEffectiveRoi() {
    // return this.importance // ?? maybe return medium
  }

}
