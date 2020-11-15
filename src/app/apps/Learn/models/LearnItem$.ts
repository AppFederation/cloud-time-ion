import {OdmItem$2} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {LearnDoService} from '../core/learn-do.service'
import {NumericPickerVal} from '../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {OdmBackend} from '../../../libs/AppFedShared/odm/OdmBackend'
import {ImportanceVal, LearnItem} from './LearnItem'
import {IntensityDescriptors} from './fields/intensity.model'
import {ImportanceDescriptor, ImportanceDescriptors, importanceDescriptors} from './fields/importance.model'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {Distribution} from '../../../libs/AppFedShared/utils/numbers/distributions/distribution'
import {Quiz, Quizzable$} from './quiz'
import {debugLog} from '../../../libs/AppFedShared/utils/log'

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

  /* TODO return descriptor */
  getEffectiveImportance(): ImportanceVal {
    return this.val ?. importance ?? importanceDescriptors.undefined
  }

  getEffectiveImportanceNumeric(): number {
    return ( this.val ?. importance ?? importanceDescriptors.medium ) ?. numeric
  }

  getEffectiveFunLevel(): Distribution {
    return 999
    // return this.importance // ?? maybe return medium
  }

  getEffectiveMentalEffort() {
    // return this.importance // ?? maybe return medium
  }

  getEffectiveRoi(): Distribution {
    return 999 // FIXME
    // return this.importance // ?? maybe return medium
  }

  getEffectiveImportanceAbbrev() {
    const effectiveImportance = this.getEffectiveImportance()
    // if ( ! effectiveImportance || effectiveImportance === importanceDescriptors.undefined) {
    //   return 'Udf_Imp'
    // } else {
      const idStr = effectiveImportance.id
      const importanceDescriptor = importanceDescriptors[idStr]
    const shortId = importanceDescriptor ?. shortId
    // if ( ! shortId ) {
    //   debugLog(`no shortId`, shortId, importanceDescriptor, this.val?.importance)
    // }
    return shortId + '_Imp'
    // }
  }

  // TODO: start introducing item$.task.smth() for middle coupling (but not for general stuff like importance)

}
