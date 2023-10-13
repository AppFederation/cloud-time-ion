import {OdmItem$2} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {LearnItemItemsService} from '../core/learn-item-items.service'
import {NumericPickerVal} from '../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {OdmBackend} from '../../../libs/AppFedShared/odm/OdmBackend'
import {ImportanceId, ImportanceVal, IntensityVal, LearnItem, MentalLevelVal, PositiveInt, PositiveIntOrZero} from './LearnItem'
import {IntensityDescriptors} from './fields/intensity.model'
import {ImportanceDescriptor, ImportanceDescriptors, importanceDescriptors, importanceDescriptors2} from './fields/importance.model'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {Distribution} from '../../../libs/AppFedShared/utils/numbers/distributions/distribution'
import {Quiz, Quizzable$} from '../core/quiz/quiz'
import {debugLog} from '../../../libs/AppFedShared/utils/log'
import {funLevels, funLevelsDescriptors, FunLevelVal} from './fields/fun-level.model'
import {mentalEffortLevels, mentalEffortLevelsDescriptors} from './fields/mental-effort-level.model'
import {isNullishOrEmptyOrBlank} from '../../../libs/AppFedShared/utils/utils'
import {SelfRating} from './fields/self-rating.model'
import {Side, sidesDefs} from '../core/sidesDefs'
import {map} from 'rxjs/operators'

// export class Quiz {
//   // status$: {
//   //   whenNextRepetition: Date
//   //   isInFuture: boolean
//   // }
// }

export type ItemCategory = string

export class LearnItem$
  extends OdmItem$2<
      LearnItem$,
      LearnItem,
      LearnItem,
      LearnItemItemsService>
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
      lastSelfRating: newEffectiveRating as SelfRating,
      whenLastSelfRated: OdmBackend.nowTimestamp(),
      selfRatingsCount: ((item?.selfRatingsCount || 0) + 1) as PositiveIntOrZero,
    }, {
      dontSetWhenLastModified: true
    })

  }

  /* TODO return descriptor always; take from ActionableItemComponent.getImportanceDescriptor */
  getEffectiveImportance(): ImportanceVal {
    // TODO get it from parents
    let item$: LearnItem$ | undefined = this
    // while (true ) {
    //   if ( ! item$.parents?.length || item$.val ) {
    // TODO getEffectiveImportance() from parents
    //     break
    //   }
    //   item$ = item$.parents?.[0]
    //   // break if there is importance OR no parents
    // }
    return item$.val ?. importanceCurrent
      ?? item$.val ?. importance
      ?? item$.getImportanceFromCategories()
      ?? importanceDescriptors.undefined
  }

  getEffectiveImportanceNumeric(): number {
    // return ( this.val ?. importance ?? importanceDescriptors.medium ) ?. numeric
    return this.getEffectiveImportance() ?. numeric
  }

  getEffectiveFunLevel(): FunLevelVal {
    return this.val ?. funEstimate ?? funLevelsDescriptors.descriptors.undefined
    // return this.importance // ?? maybe return medium
  }

  getEffectiveMentalEffort(): MentalLevelVal {
    return this.val ?. mentalLevelEstimate ?? mentalEffortLevels.undefined
    // return this.importance // ?? maybe return medium
  }

  // TODO: start introducing item$.task.smth() for middle coupling (but not for general stuff like importance)

  getEffectiveRoi(): Distribution | undefined {
    return this . getRoi()
    // return 999 // FIXME
    // return this.importance // ?? maybe return medium
  }

  /** TODO: ROI could also take into account mental effort (maybe even fun), money (as also if something is more expensive, the decision requires more mental effort, time;
   * more likely to get postponed
   * This could be normalized to e.g. values in euros,
   * e.g. 100 eur in 1h is 1 ROI point.
   * Total life health and peace of mind is 1..20 million eur (max mental and physical health impact and max fun; add or multiply; multiply probably too crazy out-of-control unpredictable).
   * Could have also relationships impact.
   * */
  getRoi() {
    const durationEstimateMs = this.val?.getDurationEstimateMs()
    if ( ! durationEstimateMs ) {
      return undefined
    }
    // const importance = this.importance?.numeric
    const importance = this.getEffectiveImportanceNumeric()
    if ( ! importance ) {
      return undefined
    }
    return importance / durationEstimateMs
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

  private getImportanceFromCategories() {
    if ( ! isNullishOrEmptyOrBlank(this.val?.de) ) {
      // TODO: check if it is question/answer side
      return importanceDescriptors.low // quick hack; TODO: read importance from category items and find max
    } /* German first to override */
    if ( ! isNullishOrEmptyOrBlank(this.val?.en) ) {
      return importanceDescriptors.medium // quick hack; TODO: read importance from category items and find max
    }
    if ( ! isNullishOrEmptyOrBlank(this.val?.es) ) {
      return importanceDescriptors.medium // quick hack; TODO: read importance from category items and find max
    }
  }

  matchesAnyFilterText(textFilterStrings: string[]): boolean {
    if ( ! textFilterStrings ?. length ) {
      return true
    }

    return textFilterStrings.some(searchedStr => {
      return this.val?.matchesSearch(searchedStr)
    })
  }

  public hasAnyCategory(searchCategories: ItemCategory[]): boolean {
    if ( ! searchCategories ?. length ) {
      return true
    }
    // FIXME: getEffectiveCategories -- as array / Set
    // const myCategories = (this.getFieldVal(sidesDefs.categories) as string ?? '') ?. toLowerCase()
    const myCategories = this.getEffectiveCategories()?.toLowerCase()
    // console.log(`myCategories getEffectiveCategories()`, myCategories)
    return searchCategories.some(
      searchCategory => myCategories ?. includes(searchCategory)
    )
  }

  hasEffectiveFunLevelAtLeast(minFunLevel: FunLevelVal): boolean {
    // return true
    if ( ! minFunLevel || minFunLevel.id === funLevels.undefined.id ) {
      return true
    } else {
      return this.getEffectiveFunLevel().numeric >= minFunLevel.numeric
    }
  }

  public getFieldVal(side: Side) {
    return this.val?.[side.id as keyof LearnItem]
  }

  /* TODO return descriptor always; take from ActionableItemComponent.getImportanceDescriptor */
  getEffectivePhysicalHealthImpact(): IntensityVal {
    return this.val ?. physicalHealthImpact ?? funLevelsDescriptors.descriptors.undefined
  }

  public getEffectivePhysicalHealthImpactNumeric(): number {
    return this.getEffectivePhysicalHealthImpact() ?. numeric
  }

  /* TODO return descriptor always; take from ActionableItemComponent.getImportanceDescriptor */
  public getEffectiveMentalHealthImpact(): IntensityVal {
    return this.val ?. mentalHealthImpact ?? funLevelsDescriptors.descriptors.undefined
  }

  public getEffectiveMentalHealthImpactNumeric(): number {
    return this.getEffectiveMentalHealthImpact() ?. numeric
  }

  public getEffectiveCategories(): string {
    let item$: LearnItem$ | undefined = this
    let retCategories = ''
    while (true) {
      const categories = item$?.val?.categories
      if ( categories ) {
        retCategories += ', ' + categories
      }
      if ( ! item$.parents?.length ) {
        break
      }
      item$ = item$.parents?.[0]
      // break if there is importance OR no parents
    }
    return retCategories
  }

  public getTitleOrQuestion$() {
    return this.val$.pipe(
      map(val => val?.getQuestion())
    )
  }

  public getRouterLinkUrl() {
    return '/learn/item/' + this ?. id
  }
}
